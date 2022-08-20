/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map((f) => path.basename(f, '.js'));

describe('all rule files should be exported by the plugin', () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName)) // eslint-disable-line global-require, import/no-dynamic-require
      );
    });
  });
});

describe('rule implementation files have the correct content', () => {
  ruleFiles.forEach((ruleName) => {
    const TYPE_ANNOTATION = "/** @type {import('eslint').Rule.RuleModule} */";
    it(ruleName, () => {
      const rulePath = path.join('lib', 'rules', `${ruleName}.js`);
      const ruleContents = fs.readFileSync(rulePath, 'utf8');

      assert.ok(ruleContents.includes(TYPE_ANNOTATION), `includes type annotation on exported rule object: ${TYPE_ANNOTATION}`);
    });
  });
});

describe('rule documentation files have the correct content', () => {
  const MESSAGES = {
    fixable: '🔧 This rule is automatically fixable using the `--fix` [flag](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) on the command line.',
    hasSuggestions: '💡 This rule provides editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).',
  };

  ruleFiles.forEach((ruleName) => {
    const rule = plugin.rules[ruleName];
    const documentPath = path.join('docs', 'rules', `${ruleName}.md`);
    const documentContents = fs.readFileSync(documentPath, 'utf8');
    const documentLines = documentContents.split('\n');

    // Decide which notices should be shown at the top of the doc.
    const expectedNotices = [];
    const unexpectedNotices = [];
    if (rule.meta.fixable) {
      expectedNotices.push('fixable');
    } else {
      unexpectedNotices.push('fixable');
    }
    if (rule.meta.hasSuggestions) {
      expectedNotices.push('hasSuggestions');
    } else {
      unexpectedNotices.push('hasSuggestions');
    }

    // Ensure that expected notices are present in the correct order.
    let currentLineNumber = 1;
    expectedNotices.forEach((expectedNotice) => {
      assert.strictEqual(documentLines[currentLineNumber], '', `${ruleName} includes blank line ahead of ${expectedNotice} notice`);
      assert.strictEqual(documentLines[currentLineNumber + 1], MESSAGES[expectedNotice], `${ruleName} includes ${expectedNotice} notice`);
      currentLineNumber += 2;
    });

    // Ensure that unexpected notices are not present.
    unexpectedNotices.forEach((unexpectedNotice) => {
      assert.ok(!documentContents.includes(MESSAGES[unexpectedNotice]), `${ruleName} does not include unexpected ${unexpectedNotice} notice`);
    });
  });
});

describe('deprecated rules', () => {
  it('marks all deprecated rules as deprecated', () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        assert(isDeprecated, `${ruleName} metadata should mark it as deprecated`);
      } else {
        assert(!isDeprecated, `${ruleName} metadata should not mark it as deprecated`);
      }
    });
  });
});

describe('configurations', () => {
  it('should export a ‘recommended’ configuration', () => {
    const configName = 'recommended';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      const subRuleName = ruleName.slice('react/'.length);
      assert(plugin.rules[subRuleName]);
    });

    ruleFiles.forEach((ruleName) => {
      const inRecommendedConfig = !!plugin.configs[configName].rules[`react/${ruleName}`];
      const isRecommended = plugin.rules[ruleName].meta.docs[configName];
      if (inRecommendedConfig) {
        assert(isRecommended, `${ruleName} metadata should mark it as recommended`);
      } else {
        assert(!isRecommended, `${ruleName} metadata should not mark it as recommended`);
      }
    });
  });

  it('should export an ‘all’ configuration', () => {
    const configName = 'all';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(plugin.configs[configName].rules[ruleName], 2);
    });

    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inConfig = typeof plugin.configs[configName].rules[`react/${ruleName}`] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig); // eslint-disable-line no-bitwise
    });
  });

  it('should export a \'jsx-runtime\' configuration', () => {
    const configName = 'jsx-runtime';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(plugin.configs[configName].rules[ruleName], 0);

      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inConfig = typeof plugin.configs[configName].rules[ruleName] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig); // eslint-disable-line no-bitwise
    });
  });
});
