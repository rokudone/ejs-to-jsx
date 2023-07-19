import {replace} from './replace'

const baseData = {
  begin: [-1, 0, 0],
  ender: [2, 2, 2],
  lexer: ['markup', 'markup', 'markup'],
  lines: [0, 0, 0],
  stack: ['global', 'div', 'div'],
}

describe('replace test', (): void => {
  test('output', (): void => {

    const data = {
      ...baseData,
      token: ['<div>', '<%= name %>', '</div>'],
      types: ['start', 'template', 'end']
    };

    const expected = {
      token: ['<div>', '{ name }', '</div>'],
      types: ['start', 'template', 'end']
    };

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('unescaped output', (): void => {

    const data = {
      ...baseData,
      token: ['<div>', '<%- name %>', '</div>'],
      types: ['start', 'template', 'end']
    };

    const expected = {
      token: ['<div>', '<div dangerouslySetInnerHTML={{ __html: (name) }} />', '</div>'],
      types: ['start', 'template', 'end']
    };

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })


  test('attribute', (): void => {
    const data = {
      ...baseData,
      token: ['<div>', 'class="<%= name %>"', '</div>'],
      types: ['start', 'template_attribute', 'end']
    }

    const expected = {
      token: ['<div>', 'className={name}', '</div>'],
      types: ['start', 'template_attribute', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('unescaped attribute', (): void => {
    const data = {
      ...baseData,
      token: ['<div>', 'class="<%- name %>"', '</div>'],
      types: ['start', 'template_attribute', 'end']
    }

    const expected = {
      token: ['<div>', 'className={name}', '</div>'],
      types: ['start', 'template_attribute', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('multiple attribute', (): void => {
    const common = {
      begin: [ -1, 0, 0, 0 ],
      ender: [ 3, 3, 3, 3 ],
      lexer: [ 'markup', 'markup', 'markup', 'markup' ],
      lines: [ 0, 1, 1, 0 ],
      stack: [ 'global', 'div', 'div', 'div' ],
    }
    const data = {
      ...common,
      token: [
        '<div>',
        "hoge='hogehoge <%- name %>'",
        "fuga='fugafuga <%- name %>'",
        '</div>'
      ],
      types: [ 'start', 'attribute', 'attribute', 'end' ]
    };

    const expected = {
      token: [
        '<div>',
        "hoge=`hogehoge ${name}`",
        "fuga=`fugafuga ${name}`",
        '</div>'
      ],
      types: [ 'start', 'template_attribute', 'template_attribute', 'end' ]
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('style attribute', (): void => {
    const data = {
      ...baseData,
      token: [ '<div>', "style='hoge: fuga'", '</div>' ],
      types: [ 'start', 'attribute', 'end' ]
    };

    const expected = {
      ...baseData,
      token: [ '<div>', 'style={{hoge: "fuga"}}', '</div>' ],
      types: [ 'start', 'template_attribute', 'end' ]
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('multi style attribute', (): void => {
    const data = {
      ...baseData,
      token: [ '<div>', "style='hoge: fuga; piyo: piyo piyo'", '</div>' ],
      types: [ 'start', 'attribute', 'end' ]
    };

    const expected = {
      ...baseData,
      token: [ '<div>', 'style={{hoge: "fuga", piyo: "piyo piyo"}}', '</div>' ],
      types: [ 'start', 'template_attribute', 'end' ]
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('style template attribute', (): void => {
    const data = {
      ...baseData,
      token: [ '<div>', "style='hoge: <%= fuga %>'", '</div>' ],
      types: [ 'start', 'attribute', 'end' ]
    };

    const expected = {
      token: [ '<div>', "style={{hoge: fuga}}", '</div>' ],
      types: [ 'start', 'template_attribute', 'end' ]
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('comment', (): void => {
    const data = {
      ...baseData,
      token: ['<div>', '<%# name %>', '</div>'],
      types: ['start', 'comment', 'end']
    }

    const expected = {
      ...baseData,
      token: ['<div>', '{/* name */}', '</div>'],
      types: ['start', 'comment', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('argument', (): void => {
    const data = {
      ...baseData,
      token: ['<div>', '<% var name="hoge" %>', '</div>'],
      types: ['start', 'template', 'end']
    }

    const expected = {
      token: ['<div>', 'var name="hoge"', '</div>'],
      types: ['start', 'template_argument', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('argument start', (): void => {
    const data = {
      begin: [-1, 0, 0],
      ender: [2, 2, 2],
      lexer: ['markup', 'markup', 'markup'],
      lines: [0, 0, 0],
      stack: ['global', 'div', 'div'],
      token: ['<div>', '<% var name=() => {%>', '</div>'],
      types: ['start', 'template_start', 'end']
    }

    const expected = {
      token: ['<div>', 'var name=() => {', 'return (', '</div>'],
      types: ['start', 'script_start', 'script_start', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('function', (): void => {
    const data = {
      begin: [-1, 0, 0],
      ender: [2, 2, 2],
      lexer: ['markup', 'markup', 'markup'],
      lines: [0, 0, 0],
      stack: ['global', 'div', 'div'],
      token: ['<div>', '<% function hoge() {}%>', '</div>'],
      types: ['start', 'template', 'end']
    }

    const expected = {
      token: ['<div>', 'function hoge() {}', '</div>'],
      types: ['start', 'script_start', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('template_start', (): void => {
    const data = {
      begin: [-1, 0, 0],
      ender: [2, 2, 2],
      lexer: ['markup', 'markup', 'markup'],
      lines: [0, 0, 0],
      stack: ['global', 'div', 'div'],
      token: ['<div>', '<% (function() { %>', '</div>'],
      types: ['start', 'template_start', 'end']
    }

    const expected = {
      token: ['<div>', '{(function() {', 'return (', '</div>'],
      types: ['start', 'script_start', 'script_start', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('template_end', (): void => {
    const data = {
      ...baseData,
      token: ['<div>', '<% }%>', '</div>'],
      types: ['start', 'template_end', 'end']
    }

    const expected = {
      token: ['<div>', ')', '}}', '</div>'],
      types: ['start', 'script_end', 'script_end', 'end']
    }

    const result = replace(data);

    expect(expected.token).toEqual(result.token);
    expect(expected.types).toEqual(result.types);
  })

  test('void element', (): void => {
    const data = {
      begin: [
        -1,  0,  1,  2, 3,  4,
        5,  6,  7,  8, 9, 10,
        11, 12, 13, 14
      ],
      ender: [
        -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1
      ],
      lexer: [
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup',
        'markup', 'markup'
      ],
      lines: [
        0, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2,
        2, 2, 2, 2
      ],
      stack: [
        'global',   'area',
        'base',     'br',
        'col',      'embed',
        'hr',       'iframe',
        'img',      'input',
        'link',     'meta',
        'param',    'source',
        'template', 'track'
      ],
      token: [
        '<area>',   '<base>',
        '<br>',     '<col>',
        '<embed>',  '<hr>',
        '<iframe>', '<img>',
        '<input>',  '<link>',
        '<meta>',   '<param>',
        '<source>', '<template>',
        '<track>',  '<wbr>'
      ],
      types: [
        'start', 'start', 'start',
        'start', 'start', 'start',
        'start', 'start', 'start',
        'start', 'start', 'start',
        'start', 'start', 'start',
        'start'
      ]
    };

    const expectedToken = [
      '<area/>',   '<base/>',
      '<br/>',     '<col/>',
      '<embed/>',  '<hr/>',
      '<iframe/>', '<img/>',
      '<input/>',  '<link/>',
      '<meta/>',   '<param/>',
      '<source/>', '<template/>',
      '<track/>',  '<wbr/>'
    ];

    const expectedTypes = [
      'singleton', 'singleton', 'singleton',
      'singleton', 'singleton', 'singleton',
      'singleton', 'singleton', 'singleton',
      'singleton', 'singleton', 'singleton',
      'singleton', 'singleton', 'singleton',
      'singleton'
    ];

    const result = replace(data);

    expect(expectedToken).toEqual(result.token);
    expect(expectedTypes).toEqual(result.types);
  });
})
