document.getElementById("searchBtn").addEventListener("click", performSearch);

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += chunkSize)
            R.push(this.slice(i, i + chunkSize));
        return R;
    }
});

function transformToRegex(rule) {
    // Should be done better
    return rule.replaceAll("/", "\\/").replaceAll(".", "\\.").replaceAll("?", "\\?").replaceAll("*", ".*").concat("$");
}

function buildRule(rule) {
    return transformToRegex(rule);
}

function clearList() {
    document.getElementById("matchedRulesList").innerHTML = "";
    document.getElementById("appliedRules").innerHTML = "";
}

function buildLineItem(data) {
    let html = "";
    html += "<li class=\"list-group-item d-flex justify-content-between bg-light\">\n";
    html += "<div " + (data.index == 0 ? "class=\"text-success\"" : "") + ">\n";
    html += "<h6 class=\"my-0\">Rule " + data.ruleNumber + "</h6>\n";
    html += "<small>" + data.rule + "</small>\n";
    html += "</div>\n";
    html += "<span " + (data.index == 0 ? "class=\"text-success\"" : "") + "></span>\n";
    html += "</li>";
    return html;
}

function showResults(results) {
    clearList();
    const list = document.getElementById("matchedRulesList");
    document.getElementById("appliedRules").innerHTML = results.length;
    for (let i = 0; i < results.length; i++) {
        list.innerHTML += buildLineItem({
            ruleNumber: results[i][0],
            rule: results[i][2],
            index: i
        });
    }
}

function performSearch() {
    const url = document.getElementById("url").value;
    let copiedRules = document.getElementById("pageRules").value;
    let splitRules = copiedRules.replaceAll(/\t/g, '').split(/\r?\n/);
    let chunkedRules = splitRules.chunk(6);
    let results = [];
    for (let i = 0; i < chunkedRules.length; i++) {
        const regex = buildRule(chunkedRules[i][2]);
        console.log(regex);
        const matches = url.match(regex);
        if (matches && matches.length > 0) {
            results.push(chunkedRules[i]);
        }
    }
    showResults(results);
}