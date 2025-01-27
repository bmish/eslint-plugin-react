/**
 * @fileoverview Tests for no-redundant-should-component-update
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-redundant-should-component-update');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-redundant-should-component-update', rule, {
  valid: [
    {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      parserOptions,
    },
    {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      parserOptions,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      parserOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.Component {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      parserOptions,
    },
  ],

  invalid: [
    {
      code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Foo' },
      }],
      parserOptions,
    },
    {
      code: `
        class Foo extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Foo' },
      }],
      parserOptions,
    },
    {
      code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Foo' },
      }],
      parser: parsers.BABEL_ESLINT,
      parserOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Bar' },
      }],
      parserOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Bar' },
      }],
      parserOptions,
    },
    {
      code: `
        var Foo = class extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [{
        messageId: 'noShouldCompUpdate',
        data: { component: 'Foo' },
      }],
      parserOptions,
    },
  ],
});
