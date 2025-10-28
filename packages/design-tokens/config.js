import StyleDictionary from 'style-dictionary';
import { propertyFormatNames } from 'style-dictionary/enums';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

const { css } = propertyFormatNames;

/**
 * Clone formatting object without a prefix to mimic built-in css/variables behavior.
 * @param {import('style-dictionary/types').FormattingOverrides | undefined} formatting
 */
function getFormattingCloneWithoutPrefix(formatting) {
  if (!formatting) {
    return formatting;
  }
  const formattingWithoutPrefix = structuredClone(formatting);
  // prefix is not used by fileHeader helper; remove if provided.
  delete formattingWithoutPrefix.prefix;
  return formattingWithoutPrefix;
}

StyleDictionary.registerFormat({
  name: 'css/variables-with-imports',
  async format({ dictionary, options = {}, file }) {
    const selector = Array.isArray(options.selector)
      ? options.selector
      : options.selector
        ? [options.selector]
        : [':root'];
    const { outputReferences, outputReferenceFallbacks, usesDtcg, formatting } =
      options;
    const importTokens = dictionary.allTokens.filter(
      token => token.$type === 'cssImport',
    );
    const variableTokens = dictionary.allTokens.filter(
      token => token.$type !== 'cssImport',
    );
    const filteredDictionary = {
      ...dictionary,
      allTokens: variableTokens,
    };

    const header = await fileHeader({
      file,
      formatting: getFormattingCloneWithoutPrefix(formatting),
      options,
    });
    const indentation = formatting?.indentation || '  ';

    const nestInSelector = (content, selectorValue, indent) =>
      `${indent}${selectorValue} {\n${content}\n${indent}}`;

    const variables = formattedVariables({
      format: css,
      dictionary: filteredDictionary,
      outputReferences,
      outputReferenceFallbacks,
      formatting: {
        ...formatting,
        indentation: indentation.repeat(selector.length),
      },
      usesDtcg,
    });

    const importBlock = importTokens
      .map(token => `@import url("${token.$value}");`)
      .join('\n');

    const nestedVariables = selector
      .reverse()
      .reduce(
        (content, currentSelector, index) =>
          nestInSelector(
            content,
            currentSelector,
            indentation.repeat(selector.length - 1 - index),
          ),
        variables,
      );

    return (
      header +
      (importBlock ? `${importBlock}\n\n` : '') +
      nestedVariables +
      '\n'
    );
  },
});

export default {
  source: ['tokens/**/*.tokens.json*', 'assets/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables-with-imports',
        },
      ],
      options: {
        outputReferences: true,
      },
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
