(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{190:function(e,t,s){"use strict";s.r(t);var a=s(6),r=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"request-assertions"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-assertions"}},[e._v("#")]),e._v(" Request Assertions")]),e._v(" "),s("p",[s("code",[e._v("behave")]),e._v(" includes a feature to validate requests that it has received and matched successfully. Requests that are not matched by any configured Behavior on the server will result in a validation fail.")]),e._v(" "),s("p",[e._v("There are two types of validations that "),s("code",[e._v("behave")]),e._v(" supports, "),s("code",[e._v("assertions")]),e._v(" and "),s("code",[e._v("sequence")]),e._v(" validations.")]),e._v(" "),s("h2",{attrs:{id:"assertions"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#assertions"}},[e._v("#")]),e._v(" Assertions")]),e._v(" "),s("p",[e._v("The server can validate how many times a request is received and matched if at all.")]),e._v(" "),s("p",[e._v("If the validation passes, the server returns an "),s("code",[e._v("HTTP 201")]),e._v(" but if fails, the server returns an "),s("code",[e._v("HTTP 406")]),e._v(" with reason why it fails")]),e._v(" "),s("h3",{attrs:{id:"request-was-matched-at-least-once"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-was-matched-at-least-once"}},[e._v("#")]),e._v(" Request was matched at least once")]),e._v(" "),s("p",[e._v("Check if the requests have been received and matched at least once")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123"\n },\n {\n   "path": "/tasks/12"\n }\n]\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"requests-was-matched-by-an-upper-limit-count"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#requests-was-matched-by-an-upper-limit-count"}},[e._v("#")]),e._v(" Requests was matched by an upper limit count")]),e._v(" "),s("p",[e._v("Check if the requests have been received and matched "),s("code",[e._v("at most")]),e._v(" twice")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123",\n   "count": {\n      "atMost": 2,\n   }\n }\n]\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"requests-was-matched-by-a-lower-limit-count"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#requests-was-matched-by-a-lower-limit-count"}},[e._v("#")]),e._v(" Requests was matched by a lower limit count")]),e._v(" "),s("p",[e._v("Check if the requests have been received and matched "),s("code",[e._v("at least")]),e._v(" twice")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123",\n   "count": {\n      "atLeast": 2,\n   }\n }\n]\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"request-was-matched-by-an-exact-number"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-was-matched-by-an-exact-number"}},[e._v("#")]),e._v(" Request was matched by an exact number")]),e._v(" "),s("p",[e._v("Check if the requests have been received exactly twice")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123",\n   "count": {\n   "atMost": 2,\n      "atLeast": 2\n   }\n }\n]\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"request-was-never-received"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-was-never-received"}},[e._v("#")]),e._v(" Request was never received")]),e._v(" "),s("p",[e._v("Check if the requests was never matched")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123",\n   "count": {\n      "atMost": 0,\n   }\n }\n]\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"requests-were-received-at-least-at-an-interval"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#requests-were-received-at-least-at-an-interval"}},[e._v("#")]),e._v(" Requests were received at least at an interval")]),e._v(" "),s("p",[e._v("Check if this request was received more than once and at least "),s("code",[e._v("time")]),e._v(" in seconds apart. This will implicitly require that at least 2 requests was received and matched")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Check that requests were received at least 10 seconds apart")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/interval -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'{\n "requests": [{\n    "path": "/users/123"\n  },\n  {\n    "path": "/tasks/123"\n  }],\n "interval": {\n    "atLeast": 10\n  }\n}\'')]),e._v("\n")])])]),s("h3",{attrs:{id:"requests-were-received-at-most-at-an-interval"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#requests-were-received-at-most-at-an-interval"}},[e._v("#")]),e._v(" Requests were received at most at an interval")]),e._v(" "),s("p",[e._v("Check if this request was received more than once and at least "),s("code",[e._v("time")]),e._v(" in seconds apart. This will implicitly require that at most 2 requests was received and matched")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Check that requests were received at most 10 seconds apart")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/assert -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123",\n   "interval": {\n      "atMost": 10,\n   }\n }\n]\'')]),e._v("\n")])])]),s("h2",{attrs:{id:"request-sequence-assertions"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-sequence-assertions"}},[e._v("#")]),e._v(" Request Sequence Assertions")]),e._v(" "),s("p",[e._v("The "),s("code",[e._v("behave")]),e._v(" can also match the order in which requests are received by the server.")]),e._v(" "),s("h3",{attrs:{id:"requests-were-received-in-a-particular-order"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#requests-were-received-in-a-particular-order"}},[e._v("#")]),e._v(" Requests were received in a particular order")]),e._v(" "),s("p",[e._v("Check if the requests were received in the specific order")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Responds with 201 if it were matched")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X PUT http://localhost:8080/_/api/requests/sequence -d "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('\'[\n {\n   "path": "/tasks/123"\n },\n {\n   "path": "/tasks/123/docs/icon.png"\n }\n]\'')]),e._v("\n")])])])])}),[],!1,null,null,null);t.default=r.exports}}]);