const util = require('util');
const fs = require('fs-extra');

function hsl(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// colorList
const cl = {
    none : "NONE",
    base04 : hsl(192, 100, 5),
    base03 : hsl(192, 100, 11),
    base02 : hsl(192, 81, 14),
    base01 : hsl(194, 14, 40),
    base00 : hsl(196, 13, 45),
    base0 : hsl(186, 8, 65),
    base1 : hsl(180, 7, 70),
    base2 : hsl(46, 42, 88),
    base3 : hsl(44, 87, 94),
    base4 : hsl(0, 0, 100),
    yellow : hsl(45, 100, 35),
    yellow100 : hsl(47, 100, 80),
    yellow300 : hsl(45, 100, 50),
    yellow500 : hsl(45, 100, 35),
    yellow700 : hsl(45, 100, 20),
    yellow900 : hsl(46, 100, 10),
    orange : hsl(18, 80, 44),
    orange100 : hsl(17, 100, 70),
    orange300 : hsl(17, 94, 51),
    orange500 : hsl(18, 80, 44),
    orange700 : hsl(18, 81, 35),
    orange900 : hsl(18, 80, 20),
    red : hsl(1, 71, 52),
    red100 : hsl(1, 100, 80),
    red300 : hsl(1, 90, 64),
    red500 : hsl(1, 71, 52),
    red700 : hsl(1, 71, 42),
    red900 : hsl(1, 71, 20),
    magenta : hsl(331, 64, 52),
    magenta100 : hsl(331, 100, 73),
    magenta300 : hsl(331, 86, 64),
    magenta500 : hsl(331, 64, 52),
    magenta700 : hsl(331, 64, 42),
    magenta900 : hsl(331, 65, 20),
    violet : hsl(237, 43, 60),
    violet100 : hsl(236, 100, 90),
    violet300 : hsl(237, 69, 77),
    violet500 : hsl(237, 43, 60),
    violet700 : hsl(237, 43, 50),
    violet900 : hsl(237, 42, 25),
    blue : hsl(205, 69, 49),
    blue100 : hsl(205, 100, 83),
    blue300 : hsl(205, 90, 62),
    blue500 : hsl(205, 69, 49),
    blue700 : hsl(205, 70, 35),
    blue900 : hsl(205, 69, 20),
    cyan : hsl(175, 59, 40),
    cyan100 : hsl(176, 100, 86),
    cyan300 : hsl(175, 85, 55),
    cyan500 : hsl(175, 59, 40),
    cyan700 : hsl(182, 59, 25),
    cyan900 : hsl(183, 58, 15),
    green : hsl(68, 100, 30),
    green100 : hsl(90, 100, 84),
    green300 : hsl(76, 100, 49),
    green500 : hsl(68, 100, 30),
    green700 : hsl(68, 100, 20),
    green900 : hsl(68, 100, 10),

    bg : hsl(192, 100, 5),
    bg_highlight : hsl(192, 100, 11),
    fg : hsl(186, 8, 55),
};

// tckm is tokenColorsKeyMap
const tckm = {
    Comment : 0,
    Variables: 1,
    Colors: 2,
    Invalid: 3,
    KeywordStorage: 4,
    OperatorMisc: 5,
    Tag: 6,
    FunctionSpecialMethod: 7,
    BlockLevelVariables: 8,
    OtherVariableStringLink: 9,
    NumberConstantFunctionArgumentTagAttributeEmbedded: 10,
    StringSymbolsInheritedClassMarkupHeading: 11,
    ClassSupport: 12,
    EntityTypes: 13,
    CSSClassAndSupport: 14,
    SubMethod: 15,
    LanguageMethods: 16,
    EntityNameMethodJs: 17,
    MetaMethodJs: 18,
    Attributes: 19,
    HTMLAttributes: 20,
    CSSClasses: 21,
    CSSIDs: 22,
    Inserted: 23,
    Deleted: 24,
    Changed: 25,
    RegularExpressions: 26,
    EscapeCharacters: 27,
    URL: 28,
    Decorators: 29,
    ES7BindOperator: 30,
    JSONKeyLevel0: 31,
    JSONKeyLevel1: 32,
    JSONKeyLevel2: 33,
    JSONKeyLevel3: 34,
    JSONKeyLevel4: 35,
    JSONKeyLevel5: 36,
    JSONKeyLevel6: 37,
    JSONKeyLevel7: 38,
    JSONKeyLevel8: 39,
    MarkdownPlain: 40,
    MarkdownMarkupRawInline: 41,
    MarkdownMarkupRawInlinePunctuation: 42,
    MarkdownHeading: 43,
    MarkupItalic: 44,
    MarkupBold: 45,
    MarkupBoldItalic: 46,
    MarkupUnderline: 47,
    MarkdownBlockquote: 48,
    MarkupQuote: 49,
    MarkdownLink: 50,
    MarkdownLinkDescription: 51,
    MarkdownLinkAnchor: 52,
    MarkupRawBlock: 53,
    MarkdownRawBlockFenced: 54,
    MarkdownFencedBodeBlock: 55,
    MarkdownFencedBodeBlockVariable: 56,
    MarkdownFencedLanguage: 57,
    MarkdownSeparator: 58,
    MarkupTable: 59,
};

const configFilePath = './themes/solarized-osaka-color-theme.json';

const dataConfig = fs.readFileSync(configFilePath);
const jsonData = JSON.parse(dataConfig);

function mappingColors(properties = [], colors = []) {
    for (let i = 0; i < properties.length; i++) {
        jsonData.colors[properties[i]] = colors[i];
    }
}

function mappingTokenColors(properties = [], colors = []) {
    for (let i = 0; i < properties.length; i++) {
        jsonData.tokenColors[properties[i]].settings.foreground = colors[i];
    }
}

mappingColors(
    ["editor.background", "editor.foreground", "activityBarBadge.background", "activityBarBadge.background"],
    [cl.bg, cl.fg, cl.bg, cl.bg]
);

// console.log('adfamkldsfm', jsonData.tokenColors[1].settings.foreground);

mappingTokenColors(
    [
        tckm.Comment,
        tckm.Variables,
        // tckm.Colors,
        // tckm.Invalid,
        tckm.KeywordStorage,
        tckm.OperatorMisc,
        tckm.Tag, // not sure for this
        tckm.FunctionSpecialMethod,
        // tckm.BlockLevelVariables,
        // tckm.OtherVariableStringLink,
        tckm.NumberConstantFunctionArgumentTagAttributeEmbedded,
        tckm.StringSymbolsInheritedClassMarkupHeading,
        tckm.ClassSupport,
        tckm.EntityTypes,
        // tckm.CSSClassAndSupport,
        // tckm.SubMethod,
        tckm.LanguageMethods,
        // tckm.EntityNameMethodJs,
        // tckm.MetaMethodJs,
        // tckm.Attributes,
        // tckm.HTMLAttributes,
        // tckm.CSSClasses,
        // tckm.CSSIDs,
        tckm.Inserted,
        tckm.Deleted,
        tckm.Changed,
        // tckm.RegularExpressions,
        tckm.EscapeCharacters,
        // tckm.URL,
        tckm.Decorators,
        tckm.ES7BindOperator,
        // tckm.JSONKeyLevel0,
        // tckm.JSONKeyLevel1,
        // tckm.JSONKeyLevel2,
        // tckm.JSONKeyLevel3,
        // tckm.JSONKeyLevel4,
        // tckm.JSONKeyLevel5,
        // tckm.JSONKeyLevel6,
        // tckm.JSONKeyLevel7,
        // tckm.JSONKeyLevel8,
        tckm.MarkdownPlain,
        tckm.MarkdownMarkupRawInline,
        tckm.MarkdownMarkupRawInlinePunctuation,
        tckm.MarkdownHeading,
        tckm.MarkupItalic,
        tckm.MarkupBold,
        tckm.MarkupBoldItalic,
        tckm.MarkupUnderline,
        tckm.MarkdownBlockquote,
        tckm.MarkupQuote,
        tckm.MarkdownLink,
        tckm.MarkdownLinkDescription,
        tckm.MarkdownLinkAnchor,
        tckm.MarkupRawBlock,
        tckm.MarkdownRawBlockFenced,
        tckm.MarkdownFencedBodeBlock,
        tckm.MarkdownFencedBodeBlockVariable,
        tckm.MarkdownFencedLanguage,
        tckm.MarkdownSeparator,
        tckm.MarkupTable,
    ],
    [
        cl.base01,
        cl.base0,
        // cl.base0,
        // cl.base0,
        cl.green500,
        cl.green500,
        cl.orange500,
        cl.blue500,
        // cl.blue500,
        // cl.blue500,
        cl.cyan500,
        cl.cyan500,
        cl.yellow500,
        cl.yellow500,
        // cl.yellow500,
        // cl.yellow500,
        cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        cl.green500,
        cl.yellow500,
        cl.red500,
        // cl.red500,
        cl.orange700,
        // cl.orange700,
        cl.fg,
        cl.green500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
        // cl.orange500,
    ]
)

const jsonString = JSON.stringify(jsonData);
fs.writeFileSync(configFilePath, jsonString, 'utf-8', (err) => {
    if (err) throw err;
    console.log(err);
});