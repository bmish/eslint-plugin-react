/**
 * @fileoverview Prevent using unwrapped literals in a React component definition
 * @author Caleb morris
 * @author David Buchan-Swanson
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-literals');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-no-literals', rule, {
  valid: [].concat(
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                <button type="button"></button>
              </div>
            );
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['button', 'submit'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                <button type="button"></button>
              </div>
            );
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['button', 'submit'] }],
      parser: parsers.BABEL_ESLINT,
    }, parsers.TS([
      {
        code: `
          class Comp1 extends Component {
            render() {
              return (
                <div>
                  <button type="button"></button>
                </div>
              );
            }
          }
        `,
        options: [{ noStrings: true, allowedStrings: ['button', 'submit'] }],
        parser: parsers.TYPESCRIPT_ESLINT,
      },
      {
        code: `
          class Comp2 extends Component {
            render() {
              return (
                <div>
                  <button type="button"></button>
                </div>
              );
            }
          }
        `,
        options: [{ noStrings: true, allowedStrings: ['button', 'submit'] }],
        parser: parsers['@TYPESCRIPT_ESLINT'],
      },
    ]),
    {
      code: `
        class Comp2 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {'asdjfl'}
              </>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        var Hello = createReactClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                {'test'}
                {'foo'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        var foo = require('foo');
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: '<Foo bar={true} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={false} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={100} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={null} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={{}} />',
      options: [{ noStrings: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            return <Foo bar={this.asdf} class='xx' />;
          }
        }
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            let foo = \`bar\`;
            return <div />;
          }
        }
      `,
      options: [{ noStrings: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>asdf</div>
          }
        }
      `,
      options: [{ allowedStrings: ['asdf'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>asdf</div>
          }
        }
      `,
      options: [{ noStrings: false, allowedStrings: ['asdf'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>&nbsp;</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['&nbsp;'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                &nbsp;
              </div>
            );
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['&nbsp;'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>foo: {bar}*</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['foo: ', '*'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>foo</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['   foo   '] }],
    },
    {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            const xx = 'xx';

            return <Foo bar={this.asdf} class={xx} />;
          }
        }      `,
      parser: parsers.BABEL_ESLINT,
      options: [{ noStrings: true, ignoreProps: false }],
    },
    {
      code: `
        <img alt='blank image'></img>
      `,
    }
  ),

  invalid: [
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'hello' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'asdjfl' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
                test
                foo
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: {
            text: 'asdjfl\n                test\n                foo',
          },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                test
                {'foo'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'Test\'' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          {'Test' + name}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'Test\'' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: 'Test' },
        },
      ],
    },
    {
      code: `
        <Foo>
          {\`Test\`}
        </Foo>
      `,
      options: [{ noStrings: true }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test`' },
        },
      ],
    },
    {
      code: '<Foo bar={`Test`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test`' },
        },
      ],
    },
    {
      code: '<Foo bar={`${baz}`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`${baz}`' },
        },
      ],
    },
    {
      code: '<Foo bar={`Test ${baz}`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test ${baz}`' },
        },
      ],
    },
    {
      code: '<Foo bar={`foo` + \'bar\'} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`foo`' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'bar\'' },
        },
      ],
    },
    {
      code: '<Foo bar={`foo` + `bar`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`foo`' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '`bar`' },
        },
      ],
    },
    {
      code: '<Foo bar={\'foo\' + `bar`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'foo\'' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '`bar`' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div bar={'foo'}>asdf</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['asd'], ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'foo\'' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: 'asdf' },
        },
      ],
    },
    {
      code: '<Foo bar={\'bar\'} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'bar\'' },
        },
      ],
    },
    {
      code: `
        <img alt='blank image'></img>
      `,
      options: [{ noAttributeStrings: true }],
      errors: [
        {
          messageId: 'noStringsInAttributes',
          data: { text: '\'blank image\'' },
        },
      ],
    },
  ],
});
