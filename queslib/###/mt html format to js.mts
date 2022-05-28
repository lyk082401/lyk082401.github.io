{
    name: ["JavaScript", ".html", ".js", "es"]
    comment: {startsWith: "//"}
    comment: {startsWith: "/*", endsWith: "*/"}
    contains: [
        {builtin: #JAVA_QUOTED_STRING#}
        {
            color: "string"
            start: {match: /`/}
            end: {match: /(?m)`|$/}
            contains: [
                {builtin: #JAVA_ESCAPED_CHAR#}
                {match: /\$\{.*?\}/, 0: "strEscape"}
            ]
        }
        {builtin: #JAVA_NUMBER#}
        {match: keywordsToRegex(
                "break case catch class const continue debugger default delete do else enum export"
                "extends false finally for function if implements import instanceof interface let"
                "new null package private protected public return static super switch this with"
                "throw true try typeof var void while yield function"
            ), 0: "keyword"
        }
    ]
    codeFormatter: #BUILT_IN_JS_FORMATTER#
}