import { convert } from './convert';

describe('convert', () => {
  test('export', () => {
    const data = 
`<div>
  <span>{}</span>
</div>`

    const expected =
`import React from 'react';

export const Presenter = () => {
  return (
    <div>
      <span>{}</span>
    </div>
  )
};`

    expect(expected).toBe(convert(data));
  });

  test('multiple root', () => {
    const data = 
`<div>
  <span>{}</span>
</div>
<div>
  <span>{}</span>
</div>`;

    const expected =
`import React from 'react';

export const Presenter = () => {
  return (
    <div>
      <div>
        <span>{}</span>
      </div>
      <div>
        <span>{}</span>
      </div>
    </div>
  )
};`

    expect(expected).toBe(convert(data));
  })
});
