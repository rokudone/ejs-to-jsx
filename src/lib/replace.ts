import { pivot, depivot, Element } from "./pivot";

const replace = (data: data) => {

  const pivotData = pivot(data);

  const indent: number[] = [];

  const replaced = pivotData.flatMap((element: Element, index: number): Element | Element[] => {
    switch (true) {
      case isOutputScriptLet(element):
        return {
          ...element,
          token: element.token
            .replace(/<%=[_]? /, "{ ")
            .replace(/ [_]?%>/, " }"),
        }
      case isUnescapedOutputScriptLet(element):
        return {
          ...element,
          // XXX: ほんとにこれでいいのか？div一個ふえるけど
          token: element.token
            .replace(/<%-[_]? /, "<div dangerouslySetInnerHTML={{ __html: (")
            .replace(/ [_]?%>/, ") }} />"),
        }
      case isAttributeOutputScriptLet(element):
        return {
          ...element,
          token: convertAttribute(element.token
            .replace(/<%=[_]? /, "{")
            .replace(/ [_]?%>/, "}")
            .replace(/^([^=]+\=)["']/, "$1")
            .replace(/["']$/, "")),
        }
      case isUnescapedAttributeOutputScriptLet(element):
        return {
          ...element,
          // XXX: 多分これでいいはず。attributeの中はエスケープしちゃっていいはず
          token: convertAttribute(element.token
            .replace(/<%-[_]? /, "{")
            .replace(/ [_]?%>/, "}")
            .replace(/^([^=]+\=)["']/, "$1")
            .replace(/["']$/, "")),
        }
      case isMultipleAttributeOutputScriptLet(element):
        return {
          ...element,
          token: convertAttribute(element.token
            .replace(/<%[=-][_]? */, "${")
            .replace(/ *%>/, "}")
            .replace(/^([^=]+\=)["']/, "$1`")
            .replace(/["']$/, "`"))
          ,
          types: "template_attribute",
        }
      case isStyleAttributeScriptLet(element):
        return {
          ...element,
          token: convertAttribute(element.token
            .replace(/^style=["']/, "style={{")
            .replace(/["']$/, "}}")
            .replace(/(: *)([a-zA-Z0-9- ]+)([;}])/g, '$1"$2"$3')
            .replace(/;/g, ",")
            .replace(/<%=[_]? /, "")
            .replace(/ ?%>/, ""))
          ,
          types: "template_attribute",
        }
      case isAttributeScriptLet(element):
        return {
          ...element,
          token: convertAttribute(element.token)
        }
      case isCommentScriptLet(element):
        return {
          ...element,
          token: element.token
            .replace(/<%#/, "{/*")
            .replace(/%>/, "*/}"),
        }
      case isVariableScriptLet(element):
        return {
          ...element,
          token: element.token
            .replace(/<%[_]? */, "")
            .replace(/ *%>/, ""),
          types: "template_argument",
        }
      case isVariableStartScriptLet(element):
        return [
          {
            ...element,
            token: element.token
            .replace(/<%[_]? */, "")
            .replace(/ *%>/, ""),
            types: "script_start",
          },
          {
            ...element,
            begin: index,
            token: 'return (',
            types: "script_start",
          }
        ]
      case isFunctionScriptLet(element):
        return {
          ...element,
          token: element.token
            .replace(/<% */, "")
            .replace(/ *%>/, ""),
          types: "script_start",
        }
      case isFunctionStartScriptLet(element):
        return [
          {
            ...element,
            token: element.token
            .replace(/<% */, "")
            .replace(/ *%>/, ""),
            types: "script_start",
          },
          {
            ...element,
            begin: index,
            token: 'return (',
            types: "script_start",
          }
        ]
      case isTemplateStartScriptLet(element):
        return [
          {
            ...element,
            token: element.token
            .replace(/<% */, "{")
            .replace(/ *%>/, ""),
            types: "script_start",
          },
          {
            ...element,
            begin: index,
            token: 'return (',
            types: "script_start",
          }
        ]
      case isTemplateEndScriptLet(element):
        return [
          {
            ...element,
            begin: element.begin + 1,
            token: ')',
            types: "script_end",
          },
          {
            ...element,
            token: element.token
            .replace(/<% */, "")
            .replace(/ *%>/, "}"),
            types: "script_end",
          }
        ]
    }
    return element;
  });

  return depivot(replaced);
}

const isOutputScriptLet = (element: Element): boolean => {
  return element.types === "template"
     && /<%=[_]?.*[_]?%>/.test(element.token);
}
const isUnescapedOutputScriptLet = (element: Element): boolean => {
  return element.types === "template"
    && /<%[_]?-.*[_]?%>/.test(element.token);
}
const isAttributeScriptLet = (element: Element): boolean => {
  return element.types === "attribute"
}
const isAttributeOutputScriptLet = (element: Element): boolean => {
  return element.types === "template_attribute"
    && /<%=[_]?.*[_]?%>/.test(element.token)
    && !isStyleAttributeScriptLet(element);
}
const isUnescapedAttributeOutputScriptLet = (element: Element): boolean => {
  return element.types === "template_attribute"
    && /<%[_]?-.*[_]?%>/.test(element.token)
    && !isStyleAttributeScriptLet(element);
}
const isMultipleAttributeOutputScriptLet = (element: Element): boolean => {
  return element.types === "attribute"
    && /<%[=-][_]?.*[_]?%>/.test(element.token)
    && !isStyleAttributeScriptLet(element);
}
const isStyleAttributeScriptLet = (element: Element): boolean => {
  return element.types === "attribute"
    && /^style=/.test(element.token);
}
const isCommentScriptLet = (element: Element): boolean => {
  return element.types === "comment"
    && /<%#.*%>/.test(element.token);
}
const isVariableScriptLet = (element: Element): boolean => {
  return element.types === "template"
    && /<%[_]?.*[^!]=[^>=].*[_]?%>/.test(element.token);
}
const isVariableStartScriptLet = (element: Element): boolean => {
  return element.types === "template_start"
    && /<%[_]?.*[^!]=[^>=].*[_]?%>/.test(element.token);
}
const isFunctionScriptLet = (element: Element): boolean => {
  return element.types === "template"
    && /<%.*function +[a-zA-Z0-9]+ *\(.*%>/.test(element.token);
}
const isFunctionStartScriptLet = (element: Element): boolean => {
  return element.types === "template_start"
    && /<%.*function +[a-zA-Z0-9]+ *\(.*%>/.test(element.token);
}

const isTemplateStartScriptLet = (element: Element): boolean => {
  return element.types === "template_start"
}

const isTemplateEndScriptLet = (element: Element): boolean => {
  return element.types === "template_end"
}

const convertAttribute = (token: string): string => {
  return token.replace(/^accept/, "accept")
    .replace(/^accept-charset/, "acceptCharset")
    .replace(/^accesskey/, "accessKey")
    .replace(/^action/, "action")
    .replace(/^allowfullscreen/, "allowFullScreen")
    .replace(/^alt/, "alt")
    .replace(/^async/, "async")
    .replace(/^autocomplete/, "autoComplete")
    .replace(/^autofocus/, "autoFocus")
    .replace(/^autoplay/, "autoPlay")
    .replace(/^capture/, "capture")
    .replace(/^cellpadding/, "cellPadding")
    .replace(/^cellspacing/, "cellSpacing")
    .replace(/^challenge/, "challenge")
    .replace(/^charset/, "charSet")
    .replace(/^checked/, "checked")
    .replace(/^cite/, "cite")
    .replace(/^classid/, "classID")
    .replace(/^class/, "className")
    .replace(/^colspan/, "colSpan")
    .replace(/^cols/, "cols")
    .replace(/^content/, "content")
    .replace(/^contenteditable/, "contentEditable")
    .replace(/^contextmenu/, "contextMenu")
    .replace(/^controls/, "controls")
    .replace(/^controlslist/, "controlsList")
    .replace(/^coords/, "coords")
    .replace(/^crossorigin/, "crossOrigin")
    .replace(/^data/, "data")
    .replace(/^datetime/, "dateTime")
    .replace(/^default/, "default")
    .replace(/^defer/, "defer")
    .replace(/^dir/, "dir")
    .replace(/^disabled/, "disabled")
    .replace(/^download/, "download")
    .replace(/^draggable/, "draggable")
    .replace(/^enctype/, "encType")
    .replace(/^form/, "form")
    .replace(/^formaction/, "formAction")
    .replace(/^formenctype/, "formEncType")
    .replace(/^formmethod/, "formMethod")
    .replace(/^formnovalidate/, "formNoValidate")
    .replace(/^formtarget/, "formTarget")
    .replace(/^frameborder/, "frameBorder")
    .replace(/^headers/, "headers")
    .replace(/^height/, "height")
    .replace(/^hidden/, "hidden")
    .replace(/^high/, "high")
    .replace(/^href/, "href")
    .replace(/^hreflang/, "hrefLang")
    .replace(/^for/, "htmlFor")
    .replace(/^http-equiv/, "httpEquiv")
    .replace(/^icon/, "icon")
    .replace(/^id/, "id")
    .replace(/^inputmode/, "inputMode")
    .replace(/^integrity/, "integrity")
    .replace(/^is/, "is")
    .replace(/^keyparams/, "keyParams")
    .replace(/^keytype/, "keyType")
    .replace(/^kind/, "kind")
    .replace(/^label/, "label")
    .replace(/^lang/, "lang")
    .replace(/^list/, "list")
    .replace(/^loop/, "loop")
    .replace(/^low/, "low")
    .replace(/^manifest/, "manifest")
    .replace(/^marginheight/, "marginHeight")
    .replace(/^marginwidth/, "marginWidth")
    .replace(/^max/, "max")
    .replace(/^maxlength/, "maxLength")
    .replace(/^media/, "media")
    .replace(/^mediagroup/, "mediaGroup")
    .replace(/^method/, "method")
    .replace(/^min/, "min")
    .replace(/^minlength/, "minLength")
    .replace(/^multiple/, "multiple")
    .replace(/^muted/, "muted")
    .replace(/^name/, "name")
    .replace(/^novalidate/, "noValidate")
    .replace(/^nonce/, "nonce")
    .replace(/^open/, "open")
    .replace(/^optimum/, "optimum")
    .replace(/^pattern/, "pattern")
    .replace(/^placeholder/, "placeholder")
    .replace(/^poster/, "poster")
    .replace(/^preload/, "preload")
    .replace(/^profile/, "profile")
    .replace(/^radiogroup/, "radioGroup")
    .replace(/^readonly/, "readOnly")
    .replace(/^rel/, "rel")
    .replace(/^required/, "required")
    .replace(/^reversed/, "reversed")
    .replace(/^role/, "role")
    .replace(/^rowspan/, "rowSpan")
    .replace(/^rows/, "rows")
    .replace(/^sandbox/, "sandbox")
    .replace(/^scope/, "scope")
    .replace(/^scoped/, "scoped")
    .replace(/^scrolling/, "scrolling")
    .replace(/^seamless/, "seamless")
    .replace(/^selected/, "selected")
    .replace(/^shape/, "shape")
    .replace(/^size/, "size")
    .replace(/^sizes/, "sizes")
    .replace(/^span/, "span")
    .replace(/^spellcheck/, "spellCheck")
    .replace(/^src/, "src")
    .replace(/^srcdoc/, "srcDoc")
    .replace(/^srclang/, "srcLang")
    .replace(/^srcset/, "srcSet")
    .replace(/^start/, "start")
    .replace(/^step/, "step")
    .replace(/^style/, "style")
    .replace(/^summary/, "summary")
    .replace(/^tabindex/, "tabIndex")
    .replace(/^target/, "target")
    .replace(/^title/, "title")
    .replace(/^type/, "type")
    .replace(/^usemap/, "useMap")
    .replace(/^value/, "value")
    .replace(/^width/, "width")
    .replace(/^wmode/, "wmode")
    .replace(/^wrap/, "wrap")
}

export { replace };
