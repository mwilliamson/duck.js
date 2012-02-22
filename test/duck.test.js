var duck = require("../");

var testMatcher = function(options) {
    return function(test) {
        var matcher = options.matcher;
        var positives = options.positives;
        var negatives = options.negatives;
        
        positives.forEach(function(positive) {
            test.same(true, matcher.matches(positive));
            var result = matcher.matchesWithDescription(positive);
            test.same(true, result.matches);
            test.same("", result.description);
        });
        negatives.forEach(function(negative) {
            test.same(false, matcher.matches(negative.value));
            var result = matcher.matchesWithDescription(negative.value);
            test.same(false, result.matches);
            test.same(negative.description, result.description);
        });
        
        test.done();
    };
};

exports.isMatchesValueUsingTripleEquals = testMatcher({
    matcher: duck.is(1),
    positives: [1],
    negatives: [
        {value: 2, description: "got 2"},
        {value: "1", description: "got '1'"},
        {value: null, description: "got null"}
    ]
});
