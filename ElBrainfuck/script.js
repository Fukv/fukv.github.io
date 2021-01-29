function a(d) { return document.getElementById(d) }

function l(d) {
    var f = a("status");
    for (d = document.createTextNode(d); f.firstChild;) f.removeChild(f.firstChild);
    f.appendChild(d)
}

function B(d) { d = String(d); for (var f = d.length - 3; 0 < f; f -= 3) d = d.substring(0, f) + "." + d.substring(f); return d }
var L;

function M() {
    function d() {}

    function f(c) {
        var d = Math.max(0, a("editor").value.split("\n").length);
        a("rows").scrollTop = a("editor").scrollTop;
        setTimeout(function() { a("rows").scrollTop = a("editor").scrollTop }, 300);
        if (d !== C || c !== N) {
            N = c;
            a("rows").removeChild(a("rows").firstChild);
            var b = "";
            for (C = d; 0 < d; d--) b = d === c ? "=>\n" + b : d + ".\n" + b;
            a("rows").appendChild(document.createTextNode(b))
        }
    }

    function e(c) {
        for (var b = a("memory_sidebar"), e = a("memory_view"), f, g = {}; b.lastChild;) b.removeChild(b.lastChild);
        if (c) {
            for (; e.firstChild;) e.removeChild(e.firstChild);
            e.appendChild(document.createTextNode(0 === q.length ? "run the program first" : "<- pick one"))
        }
        for (c = 0; c < q.length; c++) f = document.createElement("div"), -1 === q[c].n ? f.appendChild(document.createTextNode("final dump")) : (g[q[c].n] || (g[q[c].n] = 0), f.appendChild(document.createTextNode("dump " + q[c].n + " iteration " + g[q[c].n]++))), f.onclick = function(c, b) {
            return function U() {
                for (; e.firstChild;) e.removeChild(e.firstChild);
                var f = document.createElement("b");
                f.appendChild(document.createTextNode(b.textContent + "\n")); -
                1 !== c.n && f.appendChild(document.createTextNode("line " + c.I + " char " + c.H));
                f.appendChild(document.createTextNode("\n\n"));
                e.appendChild(f);
                e.appendChild(x(c.J, c.p, 8 === n ? 12 : 16 === n ? 8 : 4, n / 8, z));
                e.scrollTop = 0;
                d = U
            }
        }(q[c], f), b.appendChild(f);
        a("memory").style.display = "block";
        a("overlay").style.display = "block";
        document.body.style.overflow = "hidden"
    }

    function b(c, b) { for (; c.length < b;) c = "0" + c; return c }

    function x(c, d, e, f, g) {
        var I = 2,
            k, h, n = document.createElement("span"),
            q = document.createElement("b");
        if (0 === c.length) return "";
        h = "" + ("pointer = " + b(d.toString(10), 4).toUpperCase() + "\n\n");
        g ? (k = 10, f = 2 * f + (2 < f ? 2 : 1), I = 2 * I + (2 < I ? 2 : 1)) : (k = 16, f *= 2, I *= 2);
        for (var p = 0, m, r; p < c.length; p += e) {
            h += b(p.toString(k).toUpperCase(), I) + ":";
            g = "";
            for (m = 0; m < e && p + m < c.length; m++) r = c[p + m] || 0, h += "  ", p + m === d ? (n.appendChild(document.createTextNode(h)), h = "", q.appendChild(document.createTextNode(b(r.toString(k).toUpperCase(), f))), n.appendChild(q)) : h += b(r.toString(k).toUpperCase(), f), g = 33 > r || 126 < r ? g + "." : g + String.fromCharCode(r);
            h += "  ";
            if (m < e)
                for (m = (2 + f) *
                    (e - m); 0 < m; m--) h += " ";
            h += g + "\n"
        }
        n.appendChild(document.createTextNode(h));
        return n
    }

    function D(c) {
        return c.replace(/\\(?:x[0-9a-f]{1,4}|\d{1,3}|[nrt\\])/gi, function(c) {
            switch (c[1].toLowerCase()) {
                case "n":
                    return "\n";
                case "r":
                    return "\r";
                case "t":
                    return "\t";
                case "\\":
                    return "\\";
                case "x":
                    return String.fromCharCode(parseInt(c.substring(2), 16) % Math.pow(2, n));
                default:
                    return String.fromCharCode(parseInt(c.substring(1), 10) % Math.pow(2, n))
            }
        })
    }

    function E() {
        var c = URL.createObjectURL(new Blob(["(", function() {
            self.addEventListener("message",
                function(c) {
                    (new Function("", c.data.D))()
                }, !1)
        }.toString(), ")()"], { type: "application/javascript" }));
        k = new Worker(c);
        k.onmessage = function(c) {
            c = c.data;
            if (c.s) {
                var b = new Date - J;
                p = !1;
                a("run_button").className = "active_button";
                a("stop_button").className = "inactive_button";
                if (-1 === c.s) F ? l("Finished " + B(c.c) + " instructions in " + B(b) + " ms.") : l("Finished in " + B(b) + " ms.");
                else {
                    var d;
                    switch (c.s) {
                        case 3:
                            d = "Memory border overflow";
                            break;
                        case 4:
                            d = "Memory border underflow"
                    }
                    b = O(t, c.k);
                    f(b.a);
                    l("Warning: " + d + " in line " +
                        b.a + " char " + b.f + ".")
                }
                t = ""
            }
            c.o && (d = String.fromCharCode.apply(String, c.o), a("output").appendChild(document.createTextNode(d)), -1 !== d.indexOf("\n") && (a("output").scrollTop = a("output").scrollHeight));
            c.m && (b = O(t, c.k), q.push({ p: c.p, J: c.m, n: c.n, H: b.f, I: b.a }), "block" === a("memory").style.display && e(!1))
        }
    }

    function G(c, b) {
        /^\w+:/.test(c) || (c = "http://" + c);
        P(c, function(c) {
            a("editor").value = c;
            a("editor").scrollTop = 0;
            f(!1);
            p && (p = !1, k.terminate(), E());
            A()
        }, function() {!b && alert("Could not load file: " + c) })
    }

    function A() {
        if (!p) {
            q = [];
            J = +new Date;
            t = a("editor").value;
            for (var c = a("editor").value.split(""), b = D(a("input").value); a("output").firstChild;) a("output").removeChild(a("output").firstChild);
            c = Q(c, b, { v: n, g: F, j: r, l: w, A: D(u), B: K, C: !1, F: !1, i: g, G: h, u: H, h: y });
            c.error ? (l(c.error.message), f(c.error.w.a)) : (k.postMessage(c.ok), p = !0, a("run_button").className = "inactive_button", a("stop_button").className = "active_button", l("Running ..."))
        }
    }
    var n = 8,
        y = 3E4,
        g = !1,
        h = !0,
        H = !0,
        K = !0,
        u = "\n",
        F = !1,
        C = 0,
        N, k, p = !1,
        r = !1,
        w = "#",
        J, t, z = !0,
        q = [];
    if (!L) {
        L = !0;
        document.body.removeChild(a("nojsnotice"));
        E();
        a("left").style.display = a("options").style.display = "block";
        R(a("run_button"), "click", function() { A() });
        R(a("load_server_button"), "click", function() {
            var c = prompt("Enter a URL\nNote: Only servers with CORS (Cross-Origin Resource Sharing)\nDropbox, for example, works");
            c && (window.history.replaceState(null, "", "?file=" + encodeURIComponent(c).replace(/%2F/g, "/").replace(/%3A/g, ":")), G(c, !1))
        });
        R(a("link_code_button"), "click", function() {
            var c;
            c = btoa(a("editor").value).replace(/\+/g,
                "-").replace(/\//g, "_").replace(/=/g, "$");
            window.history.replaceState(null, "", "?c=" + c)
        });
        R([a("run_button"), a("stop_button"), a("load_server_button"), a("link_code_button"), a("memory_button")], "mousedown", function(c) { c.preventDefault && c.preventDefault() });
        R(a("input"), "keypress", function(c) { c = c.which || c.keyCode; if (13 === c || 10 === c) p || A() });
        R(a("load_example"), "change", function() {
            var c = a("load_example").options[a("load_example").selectedIndex].getAttribute("file");
            c && (a("input").value || (a("input").value =
                "example 123"), c = location.protocol + "//" + location.host + "/brainfuck/prog/" + c, window.history.replaceState(null, "", "?file=" + encodeURIComponent(c).replace(/%2F/g, "/").replace(/%3A/g, ":")), G(c, !1))
        });
        f(!1);
        a("editor").M = "off";
        R(a("editor"), "input", f);
        R(a("editor"), "propertychange", f);
        R(a("editor"), "scroll", function() {
            a("rows").scrollTop = a("editor").scrollTop;
            setTimeout(function() { a("rows").scrollTop = a("editor").scrollTop }, 300)
        });
        R(a("editor"), "mousewheel", function() {
            a("rows").scrollTop = a("editor").scrollTop;
            setTimeout(function() { a("rows").scrollTop = a("editor").scrollTop }, 300)
        });
        R(a("editor"), "keypress", function(c) { var b = c.which || c.keyCode;!c.ctrlKey || c.altKey || c.shiftKey || 10 !== b && 13 !== b || A() });
        R(a("stop_button"), "click", function() { p && (p = !1, k && (k.terminate(), E()), a("run_button").className = "active_button", a("stop_button").className = "inactive_button", l("Halted.")) });
        R(a("cell_size_8"), "change", function() { a("cell_size_8").checked && (n = 8) });
        R(a("cell_size_16"), "change", function() {
            a("cell_size_16").checked &&
                (n = 16)
        });
        R(a("cell_size_32"), "change", function() { a("cell_size_32").checked && (n = 32) });
        R(a("dynamic_memory"), "change", function() { g = a("memory_size").disabled = a("memory_overflow_wrap").disabled = a("memory_overflow_abort").disabled = a("dynamic_memory").checked });
        R(a("memory_size"), "change", function() { y = a("memory_size").value = a("memory_size").b = parseInt(a("memory_size").value, 10) || a("memory_size").b || 3E4 });
        R(a("memory_size"), "input", function() {
            y = a("memory_size").b = parseInt(a("memory_size").value, 10) || a("memory_size").b ||
                3E4
        });
        R([a("memory_overflow_wrap"), a("memory_overflow_abort"), a("memory_overflow_undef")], "change", function() {
            H = a("memory_overflow_wrap").checked;
            h = a("memory_overflow_undef").checked
        });
        R([a("eof_nochange"), a("eof_char")], "change", function() { K = a("eof_char_value").disabled = a("eof_nochange").checked });
        R(a("eof_char_value"), "change", function() { u = a("eof_char_value").value = a("eof_char_value").b = a("eof_char_value").value || a("eof_char_value").b || "\n" });
        R(a("dump_memory"), "change", function() {
            r = !(a("dump_memory_char").disabled = !this.checked)
        });
        R(a("dump_memory_char"), "change", function() { w = a("dump_memory_char").b = a("dump_memory_char").value.substr(0, 1) || a("dump_memory_char").b || "#" });
        R(a("count_instructions"), "change", function() { F = a("count_instructions").checked });
        for (var m = 0, v = document.getElementsByTagName("input"); m < v.length; m++)
            if (document.createEvent) {
                var S = document.createEvent("Events");
                S.initEvent("change", !1, !1);
                v[m].dispatchEvent(S)
            } else v[m].fireEvent("onchange");
        R([a("hex"), a("dec")], "change", function() {
            z = a("dec").checked;
            d()
        });
        R(a("memory_button"), "click", function() { e(!0) });
        R(a("code_button"), "click", function() {
            var c = D(a("input").value),
                c = Q(a("editor").value.split(""), c, { v: n, g: F, j: r, l: w, A: D(u), B: K, C: !1, F: !1, i: g, G: h, u: H, h: y });
            c.ok ? (a("code").style.display = "block", a("overlay").style.display = "block", document.body.style.overflow = "hidden", a("code_view").textContent = c.ok.D) : (l(c.error.message), f(c.error.w.a))
        });
        R(a("minify_button"), "click", function() {
            function c(b, c, d) {
                for (var e = 0, f = 0; f < d.length; f++)
                    if (d[f] === b) e++;
                    else if (d[f] ===
                    c) e--;
                else throw "Invalid match: " + d[f];
                return 0 <= e ? Array(e + 1).join(b) : Array(-e + 1).join(c)
            }
            for (var b = a("editor").value.replace(/[^\[\]\.,\+\-<>]/g, ""), b = b.replace(/^\[[^\[\]]*\]/g, ""), b = b.replace(/(\[[\-\+]])\[[^\[\]]*\]/g, "$1"), b = b.replace(/[\+\-]*(?:\+-|-\+)[\+\-]*/g, c.bind(this, "+", "-")), b = b.replace(/[<>]*(?:<>|><)[<>]*/g, c.bind(this, "<", ">")), d = "", e = 0; e < b.length;) d += b.slice(e, e + 80) + "\n", e += 80;
            a("code").style.display = "block";
            a("overlay").style.display = "block";
            document.body.style.overflow = "hidden";
            a("code_view").textContent = d
        });
        R([a("overlay"), a("memory_hide"), a("code_hide")], "click", function() {
            a("memory").style.display = "none";
            a("overlay").style.display = "none";
            a("code").style.display = "none";
            document.body.style.overflow = "auto"
        });
        m = T();
        if (m.c) {
            v = "";
            try { v = atob(m.c.replace(/-/g, "+").replace(/_/g, "/").replace(/\$/g, "=")) } catch (c) {}
            v && (a("editor").value = v, f(!1))
        } else m.file && G(decodeURIComponent(m.file), !0)
    }
}

function V(d, f) { return 0 === f ? d : V(f, d % f) }

function W(d, f) { for (var e = 1, b = 0, x; 1 != f;) x = e, e = b, b = x - b * (d / f | 0), x = d, d = f, f = x % f; return b }

function X(d, f, e) {
    for (e = e || 0; e < d.length; e++)
        if (d[e] === f) return e;
    return -1
}

function P(d, f, e) {
    var b = new XMLHttpRequest;
    b.onreadystatechange = function() { 4 === b.readyState && (200 === b.status ? f(b.responseText, d) : e && e(b.responseText, b.status)) };
    b.open("get", d, !0);
    b.send("")
}

function T() { for (var d = location.search.substr(1).split("&"), f, e = {}, b = 0; b < d.length; b++) f = d[b].split("="), e[f[0]] = f[1]; return e }
var R = window.addEventListener ? function(d, f, e) {
    if (d instanceof Array)
        for (var b = 0; b < d.length; b++) d[b].addEventListener(f, e, !1);
    else d.addEventListener(f, e, !1)
} : function(d, f, e) {
    if (d instanceof Array)
        for (var b = 0; b < d.length; b++) d[b].attachEvent("on" + f, e);
    else d.attachEvent("on" + f, e)
};
(L = "undefined" === typeof document.readyState ? !!document.getElementsByTagName("body")[0] : "loaded" === document.readyState || "complete" === document.readyState) ? (L = !1, M()) : (R(document, "DOMContentLoaded", M), R(window, "load", M));

function Q(d, f, e) {
    function b() { return x(n[n.length - 1]) }

    function x(b) { b = "p" + (0 < b ? "+" + b : 0 === b ? "" : b); return e.u ? "u(" + b + ")" : b }

    function D(b) { return 0 < b ? "p+=" + b + ";" : 0 === b ? "" : "p-=" + -b + ";" }

    function E() { y && (y = !1, e.i ? g += "for(;" + b() + "<0;p++)m.unshift(0);for(;" + b() + ">=m.length;)m.push(0);" : e.u || e.G || (g += "if(" + b() + ">=" + e.h + ")return self.postMessage({s:3,o:o,m:m,p:" + b() + ",n:-1,k:" + p + "});", g += "if(" + b() + "<0)return self.postMessage({s:4,o:o,m:m,p:" + b() + ",n:-1,k:" + p + "});")) }
    var G = d.length,
        A = 0,
        n = [0],
        y = !1,
        g = "",
        h = "",
        H, h = [0],
        K = "<>+-,.[]" + (e.j ? e.l : ""),
        u = Math.pow(2, e.v) - 1,
        F = 0,
        C = !e.i && "ArrayBuffer" in window,
        N = e.A.charCodeAt(0),
        k = 0;
    for (; k < G; k++) {
        var p = k;
        switch (d[k]) {
            case "+":
            case "-":
                for (var r = 1; k < G; k++)
                    if (d[k + 1] === d[p]) r++;
                    else if (-1 !== K.indexOf(d[k + 1])) break;
                e.g && (h[h.length - 1] += r);
            case "[":
            case "]":
            case ".":
            case ",":
                E()
        }
        if ("+" === d[p]) g = C ? 1 === r ? g + ("m[" + b() + "]++;") : g + ("m[" + b() + "]+=" + r + ";") : 1 === r ? g + ("m[" + b() + "]===" + u + "?(m[" + b() + "]=0):m[" + b() + "]++;") : g + ("m[" + b() + "]=m[" + b() + "]>" + (u - r) + "?(m[" + b() + "]+" + r + ")%" + (u + 1) + ":m[" +
            b() + "]+" + r + ";");
        else if ("-" === d[p]) g = C ? 1 === r ? g + ("m[" + b() + "]--;") : g + ("m[" + b() + "]-=" + r + ";") : 1 === r ? g + ("m[" + b() + "]===0?(m[" + b() + "]=" + u + "):m[" + b() + "]--;") : g + ("m[" + b() + "]=m[" + b() + "]<" + r + "?" + (u - r + 1) + "+m[" + b() + "]:m[" + b() + "]-" + r + ";");
        else if (">" === d[p]) n[n.length - 1]++, h[h.length - 1]++, y = !0;
        else if ("<" === d[p]) n[n.length - 1]--, h[h.length - 1]++, y = !0;
        else if ("[" === d[p]) {
            var w = X(d, "]", k),
                J = !1;
            if (-1 !== w && w < (X(d, "[", k + 1) + 1 || 1E9) && w < (X(d, ".", k) + 1 || 1E9) && w < (X(d, ",", k) + 1 || 1E9) && (!e.j || w < (X(d, e.l, k) + 1 || 1E9)) && !e.i) {
                for (var t = { 0: u + 1 }, z = 1, q = 0, m = 1; m < w - k; m++) { var v = d[k + m]; "+" === v ? (t[q]++, z++) : "-" === v ? (t[q]--, z++) : "<" === v ? (q--, z++, t[q] || (t[q] = 0)) : ">" === v && (q++, z++, t[q] || (t[q] = 0)) }
                if (!q && 1 === V(t[0], u + 1)) {
                    g += "if((_=m[" + b() + "])!==0){";
                    J = !0;
                    k = -W(t[0], u + 1) + u + 1;
                    for (m in t)(m = Number(m)) && 0 !== t[m] && (q = t[m] * k % (u + 1), g += "m[" + x(n[n.length - 1] + m) + "]+=_" + (1 === q ? "" : "*" + q), C || (g += "%" + (u + 1)), g += ";");
                    e.g && (g += "c+=m[" + b() + "]*" + z + ";");
                    g += "m[" + b() + "]=0;";
                    k = w;
                    g += "}";
                    e.g && (g += "c++;")
                }
            }
            J || (g += "while(m[" + b() + "]!==0){", h[h.length - 1]++, h.push(0), n.push(n[n.length -
                1]), A++, H = k + 1)
        } else if ("]" === d[p]) { if (e.g && (g += "c+=" + (h.pop() + 1) + ";"), g += D(n.pop() - n[n.length - 1]), g += "}", !A--) return f = O(d, k), { error: { w: f, message: "Syntax error: Unexpected closing bracket in line " + f.a + " char " + f.f + "." } } } else "," === d[p] ? (e.B ? g += "i.length&&(m[" + b() + "]=i.pop());" : g += "m[" + b() + "]=i.length?i.pop():" + N + ";", h[h.length - 1]++) : "." === d[p] ? (g += "q(m[" + b() + "]);", h[h.length - 1]++) : e.j && d[k] === e.l && (g += "self.postMessage({m:m,p:" + b() + ",k:" + p + ",n:" + F++ + "});")
    }
    E();
    for (k = 0; h.length;) k += h.pop();
    e.g && (g +=
        "c+=" + k + ";");
    g += "return self.postMessage({s:-1,o:o,c:c,m:m,p:" + b() + ",n:-1});";
    if (0 < A) return f = O(d, H), { error: { w: f, message: "Syntax error: Unclosed bracket in line " + f.a + " char " + f.f + "." } };
    d = [];
    for (k = f.length - 1; 0 <= k; k--) d.push(f.charCodeAt(k));
    h = "'use strict';var _,o=[],c=0,p=0,j=0," + ("i=" + JSON.stringify(d) + ",");
    C ? h += "m=new Uint" + e.v + "Array(" + e.h + ");" : (h += "m=[0];", e.i || (h += "for(j=" + e.h + ";j>0;j--)m.push(0);"));
    h = e.C ? h + "function q(i){o.push(i)};" : e.F ? h + ("o.push(m[" + b() + "]);if(m[" + b() + "]===10)self.postMessage({o:o}),o=[];") :
        h + "function q(i){self.postMessage({o:[i]})}";
    e.u && (h += "function u(n){n=n%" + e.h + ";return n<0?n+" + e.h + ":n};");
    return { ok: { D: h + g, L: "", K: [] } }
}

function O(d, f) { for (var e = { a: 1, f: 0 }, b = 0; b < f; b++) "\