;(this.webpackJsonpoptinist = this.webpackJsonpoptinist || []).push([
  [0],
  {
    1166: function (e, t) {},
    1168: function (e, t) {},
    1676: function (e, t, n) {
      'use strict'
      n.r(t)
      var r,
        a,
        c,
        i,
        o = n(0),
        u = n.n(o),
        s = n(105),
        l = n.n(s),
        d = (n(919), n(179)),
        f = n(196),
        j = n.n(f),
        p = n(175),
        b = n(112),
        h = n(29),
        m = n(1699),
        x = n(9),
        O = n(321),
        v = n(839),
        g = n.n(v),
        y = n(388),
        w = n.n(y),
        I = n(1),
        k = Object(x.a)(m.a)({ width: '100%', height: '100%' }),
        C = Object(x.a)(b.b)(function () {
          return { textDecoration: 'none' }
        }),
        S = Object(x.a)(m.a)(function () {
          return {
            width: '100%',
            height: 'calc(100% - 90px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }),
        _ = Object(x.a)(m.a)(function () {
          return {
            padding: 30,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 32,
          }
        }),
        P = Object(x.a)(m.a)(function () {
          return {
            width: 170,
            height: 150,
            backgroundColor: '#283237',
            borderRadius: 4,
            padding: '40px 30px',
            color: '#fff',
            textAlign: 'center',
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(40,50,55,0.9)',
            },
          }
        }),
        T = Object(x.a)(O.a)(function () {
          return { fontSize: 24, marginTop: 30 }
        }),
        E = function () {
          return Object(I.jsxs)(k, {
            children: [
              Object(I.jsx)('h1', {
                style: { paddingLeft: 16 },
                children: 'Dashboard',
              }),
              Object(I.jsx)(S, {
                children: Object(I.jsxs)(_, {
                  children: [
                    Object(I.jsx)(C, {
                      to: '/workspaces',
                      children: Object(I.jsx)(P, {
                        children: Object(I.jsxs)(m.a, {
                          children: [
                            Object(I.jsx)(g.a, { fontSize: 'large' }),
                            Object(I.jsx)(T, { children: 'Workspaces' }),
                          ],
                        }),
                      }),
                    }),
                    Object(I.jsx)(C, {
                      to: '/account',
                      children: Object(I.jsx)(P, {
                        children: Object(I.jsxs)(m.a, {
                          children: [
                            Object(I.jsx)(w.a, { fontSize: 'large' }),
                            Object(I.jsx)(T, { children: 'Account' }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              }),
            ],
          })
        },
        F = n(17),
        N = n(8),
        D = n(10),
        R = n.n(D),
        z = n(5),
        L = n(70),
        M = n(219),
        A = Object(x.a)(m.a)(function (e) {
          e.theme
          return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: 'fixed',
            backgroundColor: 'rgba(255,255,255,0.6)',
            zIndex: 1e5,
          }
        }),
        W = Object(M.c)(
          r || (r = Object(L.a)(['\n  100%   {transform: rotate(360deg)}\n'])),
        ),
        B = Object(M.c)(
          a ||
            (a = Object(L.a)([
              '\n  0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}\n  25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}\n  50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}\n  75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}\n  100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}\n',
            ])),
        ),
        V = Object(x.a)('span')(function (e) {
          e.theme
          return {
            display: 'block',
            width: 48,
            height: 48,
            borderRadius: '50%',
            position: 'relative',
            zIndex: 100,
            top: 'calc(50% - 24px)',
            left: 'calc(50% - 24px)',
            animation: ''.concat(W, ' 1s linear infinite'),
            '&:before': {
              content: "''",
              boxSizing: 'border-box',
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(0,0,0,0.8)',
              animation: ''.concat(B, ' 2s linear infinite'),
            },
          }
        }),
        U = function () {
          return Object(I.jsx)(A, { children: Object(I.jsx)(V, {}) })
        },
        H = n(4),
        K = n(13),
        Z = n(1696),
        G = n(1700),
        q = /^(?=.*\d)(?=.*[!#$%&()*+,-./@_|])(?=.*[a-zA-Z]).{6,255}$/,
        Y =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        X = /[^!#$%&()*+,-./@_|a-zA-Z0-9]/,
        $ = n(253),
        J = n(841),
        Q = n.n(J),
        ee = n(840),
        te = n.n(ee),
        ne = Object(x.a)('input', {
          shouldForwardProp: function (e) {
            return 'error' !== e
          },
        })(function (e) {
          return {
            width: 250,
            height: 24,
            borderRadius: 4,
            border: '1px solid',
            borderColor: e.error ? 'red' : '#d9d9d9',
            padding: '5px 10px',
            marginBottom: 15,
            transition: 'all 0.3s',
            outline: 'none',
            ':focus, :hover': { borderColor: '#1677ff' },
          }
        }),
        re = ['error'],
        ae = {
          position: 'absolute',
          right: 5,
          top: 8,
          fontSize: 20,
          cursor: 'pointer',
          color: 'rgba(0,0,0,0.6)',
        },
        ce = Object(x.a)(O.a)({
          fontSize: 12,
          minHeight: 18,
          color: 'red',
          lineHeight: '14px',
          marginTop: -14,
          wordBreak: 'break-word',
        }),
        ie = function (e) {
          var t = e.error,
            n = Object($.a)(e, re),
            r = Object(o.useState)('password'),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1]
          return Object(I.jsxs)(m.a, {
            sx: { position: 'relative' },
            children: [
              Object(I.jsx)(
                ne,
                Object(K.a)(Object(K.a)({}, n), {}, { type: c }),
              ),
              'password' === c
                ? Object(I.jsx)(te.a, {
                    style: ae,
                    onClick: function () {
                      i('text')
                    },
                  })
                : Object(I.jsx)(Q.a, {
                    style: ae,
                    onClick: function () {
                      i('password')
                    },
                  }),
              Object(I.jsx)(ce, { children: t }),
            ],
          })
        },
        oe = Object(x.a)(m.a)({
          display: 'flex',
          justifyContent: 'space-between',
        }),
        ue = Object(x.a)(m.a)(
          c ||
            (c = Object(L.a)([
              '\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 450px;\n  background-color: rgb(255, 255, 255);\n  box-shadow: rgb(0 0 0 / 20%) 0px 11px 15px -7px,\n    rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px;\n  padding: 16px;\n  border-radius: 4px;\n  outline: none;\n',
            ])),
        ),
        se = Object(x.a)(m.a)({ margin: '20px 0' }),
        le = Object(x.a)(m.a)({
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 10,
        }),
        de = Object(x.a)(O.a)({ fontSize: 14, marginTop: 7, width: '100%' }),
        fe = Object(x.a)(G.a)({
          height: 36,
          color: '#ffffff',
          marginTop: -1,
          width: 90,
          backgroundColor: '#283237 !important',
          '&:hover': { backgroundColor: '#283237' },
        }),
        je = function (e) {
          var t = e.onClose,
            n = e.open,
            r = e.onSubmit,
            a = Object(o.useState)({}),
            c = Object(N.a)(a, 2),
            i = c[0],
            u = c[1],
            s = Object(o.useState)({}),
            l = Object(N.a)(s, 2),
            d = l[0],
            f = l[1],
            j = function (e, t) {
              var n,
                r,
                a = e.target,
                c = a.name,
                o = a.value
              if (
                (f(Object(K.a)(Object(K.a)({}, d), {}, Object(H.a)({}, c, o))),
                'new_password' === c && d.confirm_password)
              )
                return null !== t && void 0 !== t && t(o)
                  ? void u(
                      Object(K.a)(
                        Object(K.a)({}, i),
                        {},
                        ((n = {}),
                        Object(H.a)(
                          n,
                          c,
                          null === t || void 0 === t ? void 0 : t(o),
                        ),
                        Object(H.a)(n, 'confirm_password', ''),
                        n),
                      ),
                    )
                  : void u(
                      Object(K.a)(
                        Object(K.a)({}, i),
                        {},
                        ((r = {}),
                        Object(H.a)(
                          r,
                          c,
                          null === t || void 0 === t ? void 0 : t(o),
                        ),
                        Object(H.a)(
                          r,
                          'confirm_password',
                          o !== d.confirm_password
                            ? 'Passwords do not match'
                            : '',
                        ),
                        r),
                      ),
                    )
              u(
                Object(K.a)(
                  Object(K.a)({}, i),
                  {},
                  Object(H.a)(
                    {},
                    c,
                    null === t || void 0 === t ? void 0 : t(o),
                  ),
                ),
              )
            },
            p = function (e) {
              return e
                ? e.length > 255
                  ? 'The text may not be longer than 255 characters'
                  : q.test(e)
                  ? X.test(e)
                    ? 'Allowed special characters (!#$%&()*+,-./@_|)'
                    : ''
                  : 'Your password must be at least 6 characters long and must contain at least one letter, number, and special character'
                : 'This field is required'
            },
            b = function (e) {
              return e
                ? e !== d.new_password
                  ? 'Passwords do not match'
                  : ''
                : 'This field is required'
            },
            h = function () {
              var e = {
                new_password: p(d.new_password),
                confirm_password: p(d.confirm_password),
              }
              i.new_password ||
                i.confirm_password ||
                (e.new_password || e.confirm_password
                  ? u(e)
                  : r(d.password, d.new_password))
            },
            x = function () {
              u({}), f({}), t()
            }
          return Object(I.jsx)(Z.a, {
            open: n,
            onClose: x,
            'aria-labelledby': 'modal-modal-title',
            'aria-describedby': 'modal-modal-description',
            children: Object(I.jsxs)(ue, {
              children: [
                Object(I.jsxs)(oe, {
                  children: [
                    Object(I.jsx)(O.a, {
                      sx: { fontWeight: 600, fontSize: 18 },
                      children: 'Change Password',
                    }),
                    Object(I.jsxs)(O.a, {
                      style: { fontSize: 13 },
                      children: [
                        Object(I.jsx)('span', {
                          style: { color: 'red' },
                          children: '*',
                        }),
                        ' is required',
                      ],
                    }),
                  ],
                }),
                Object(I.jsxs)(se, {
                  children: [
                    Object(I.jsxs)(le, {
                      children: [
                        Object(I.jsxs)(de, {
                          children: [
                            'Old Password ',
                            Object(I.jsx)('span', {
                              style: { color: 'red' },
                              children: '*',
                            }),
                          ],
                        }),
                        Object(I.jsx)(ie, {
                          onChange: function (e) {
                            return j(e)
                          },
                          name: 'password',
                          error: i.password,
                          onBlur: function (e) {
                            return j(e)
                          },
                          placeholder: 'Old Password',
                        }),
                      ],
                    }),
                    Object(I.jsxs)(le, {
                      children: [
                        Object(I.jsxs)(de, {
                          children: [
                            'New Password ',
                            Object(I.jsx)('span', {
                              style: { color: 'red' },
                              children: '*',
                            }),
                          ],
                        }),
                        Object(I.jsx)(ie, {
                          onChange: function (e) {
                            return j(e, p)
                          },
                          name: 'new_password',
                          error: i.new_password,
                          placeholder: 'New Password',
                          onBlur: function () {
                            var e = d.reEnter,
                              t = d.new_password
                            t ||
                              u(function (e) {
                                return Object(K.a)(
                                  Object(K.a)({}, e),
                                  {},
                                  { new_password: 'This field is required' },
                                )
                              }),
                              e &&
                                e !== t &&
                                u(function (e) {
                                  return Object(K.a)(
                                    Object(K.a)({}, e),
                                    {},
                                    { reEnter: 'Passwords do not match' },
                                  )
                                })
                          },
                        }),
                      ],
                    }),
                    Object(I.jsxs)(le, {
                      children: [
                        Object(I.jsxs)(de, {
                          children: [
                            'Confirm Password ',
                            Object(I.jsx)('span', {
                              style: { color: 'red' },
                              children: '*',
                            }),
                          ],
                        }),
                        Object(I.jsx)(ie, {
                          onChange: function (e) {
                            return j(e, b)
                          },
                          name: 'confirm_password',
                          error: i.confirm_password,
                          placeholder: 'Confirm Password',
                          onBlur: function (e) {
                            return j(e, b)
                          },
                        }),
                      ],
                    }),
                    Object(I.jsx)(m.a, {
                      sx: { display: 'flex', justifyContent: 'flex-end' },
                      children: Object(I.jsx)(fe, {
                        onClick: function () {
                          return h()
                        },
                        children: 'UPDATE',
                      }),
                    }),
                  ],
                }),
                Object(I.jsx)(G.a, {
                  onClick: x,
                  children: Object(I.jsx)(O.a, {
                    sx: {
                      textDecoration: 'underline',
                      textTransform: 'none',
                      lineHeight: '17px',
                    },
                    children: 'Close',
                  }),
                }),
              ],
            }),
          })
        },
        pe = Object(x.a)(m.a)(
          i ||
            (i = Object(L.a)([
              '\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 500px;\n  background-color: rgb(255, 255, 255);\n  box-shadow: rgb(0 0 0 / 20%) 0px 11px 15px -7px,\n    rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px;\n  padding: 16px;\n  border-radius: 4px;\n  outline: none;\n',
            ])),
        ),
        be = Object(x.a)(G.a)({
          backgroundColor: '#283237 !important',
          height: 36,
          marginLeft: 10,
          color: '#ffffff',
          marginTop: -1,
        }),
        he = Object(x.a)(m.a)({ margin: '20px 0 0' }),
        me = function (e) {
          var t = e.onClose,
            n = e.open,
            r = e.onSubmit,
            a = e.isLoading,
            c = e.titleSubmit,
            i = e.description,
            u = Object(o.useState)(''),
            s = Object(N.a)(u, 2),
            l = s[0],
            d = s[1]
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(Z.a, {
                open: n,
                onClose: t,
                'aria-labelledby': 'modal-modal-title',
                'aria-describedby': 'modal-modal-description',
                children: Object(I.jsxs)(pe, {
                  children: [
                    Object(I.jsxs)(O.a, {
                      style: { whiteSpace: 'pre-wrap' },
                      children: [
                        i,
                        'This operation cannot be undone. To continue, type "',
                        Object(I.jsx)('span', {
                          style: { fontWeight: 600 },
                          children: 'DELETE',
                        }),
                        '" in the box below:',
                      ],
                    }),
                    Object(I.jsxs)(he, {
                      children: [
                        Object(I.jsx)(ne, {
                          placeholder: 'DELETE',
                          value: l,
                          onChange: function (e) {
                            return d(e.target.value)
                          },
                        }),
                        Object(I.jsx)(be, {
                          onClick: function () {
                            'DELETE' === l &&
                              (null === r || void 0 === r || r(), d(''))
                          },
                          sx: { backgroundColor: 'red !important' },
                          children: c,
                        }),
                      ],
                    }),
                    Object(I.jsx)(G.a, {
                      onClick: t,
                      children: Object(I.jsx)(O.a, {
                        sx: {
                          textDecoration: 'underline',
                          textTransform: 'none',
                          lineHeight: '17px',
                        },
                        children: 'Close',
                      }),
                    }),
                  ],
                }),
              }),
              a ? Object(I.jsx)(U, {}) : null,
            ],
          })
        },
        xe = n(555),
        Oe = n.n(xe),
        ve = function (e) {
          localStorage.setItem('access_token', e)
        },
        ge = function () {
          return localStorage.removeItem('access_token')
        },
        ye = function () {
          return localStorage.removeItem('ExToken')
        },
        we = (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t) {
              var n
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), Te.post('/auth/login', t)
                    case 2:
                      return (n = e.sent), e.abrupt('return', n.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })(),
        Ie = (function () {
          var e = Object(F.a)(
            R.a.mark(function e() {
              var t
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.next = 2),
                        Te.post('/auth/refresh', {
                          refresh_token: localStorage.getItem('refresh_token'),
                        })
                      )
                    case 2:
                      return (t = e.sent), e.abrupt('return', t.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function () {
            return e.apply(this, arguments)
          }
        })(),
        ke = (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t) {
              var n
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.next = 2),
                        Te.post(
                          '/auth/send_reset_password_mail?email='.concat(t),
                        )
                      )
                    case 2:
                      return (n = e.sent), e.abrupt('return', n.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })(),
        Ce = 'localhost',
        Se = '8000',
        _e = 'http://'.concat(Ce, ':').concat(Se),
        Pe =
          ('ws://'.concat(Ce, ':').concat(Se),
          Oe.a.create({ baseURL: _e, timeout: 6e5 }))
      Pe.interceptors.request.use(
        (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t) {
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (t.headers.Authorization = 'Bearer '.concat(
                          localStorage.getItem('access_token'),
                        )),
                        (t.headers.ExToken = localStorage.getItem('ExToken')),
                        e.abrupt('return', t)
                      )
                    case 3:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })(),
        function (e) {
          return Promise.reject(e)
        },
      ),
        Pe.interceptors.response.use(
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t) {
                return R.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return e.abrupt('return', t)
                      case 1:
                      case 'end':
                        return e.stop()
                    }
                }, e)
              }),
            )
            return function (t) {
              return e.apply(this, arguments)
            }
          })(),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t) {
                var n, r, a
                return R.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          401 !==
                          (null === t ||
                          void 0 === t ||
                          null === (n = t.response) ||
                          void 0 === n
                            ? void 0
                            : n.status)
                        ) {
                          e.next = 8
                          break
                        }
                        return (e.next = 3), Ie()
                      case 3:
                        return (
                          (r = e.sent),
                          (a = r.access_token),
                          ve(a),
                          (t.config.headers.Authorization = 'Bearer '.concat(
                            a,
                          )),
                          e.abrupt('return', Oe()(t.config))
                        )
                      case 8:
                        return e.abrupt('return', Promise.reject(t))
                      case 9:
                      case 'end':
                        return e.stop()
                    }
                }, e)
              }),
            )
            return function (t) {
              return e.apply(this, arguments)
            }
          })(),
        )
      var Te = Pe,
        Ee = (function () {
          var e = Object(F.a)(
            R.a.mark(function e() {
              var t
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), Te.get('/users/me')
                    case 2:
                      return (t = e.sent), e.abrupt('return', t.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function () {
            return e.apply(this, arguments)
          }
        })(),
        Fe = (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t) {
              var n
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), Te.put('/users/me', t)
                    case 2:
                      return (n = e.sent), e.abrupt('return', n.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })(),
        Ne = (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t) {
              var n
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), Te.put('/users/me/password', t)
                    case 2:
                      return (n = e.sent), e.abrupt('return', n.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })(),
        De = (function () {
          var e = Object(F.a)(
            R.a.mark(function e() {
              var t
              return R.a.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), Te.delete('/users/me')
                    case 2:
                      return (t = e.sent), e.abrupt('return', t.data)
                    case 4:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            }),
          )
          return function () {
            return e.apply(this, arguments)
          }
        })(),
        Re = n(21),
        ze = 'user',
        Le = Object(Re.c)(
          ''.concat(ze, '/login'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.prev = 0), (e.next = 3), we(t)
                        case 3:
                          return (r = e.sent), e.abrupt('return', r)
                        case 7:
                          return (
                            (e.prev = 7),
                            (e.t0 = e.catch(0)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 10:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[0, 7]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Me = Object(Re.c)(
          ''.concat(ze, '/getMe'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.prev = 0), (e.next = 3), Ee()
                        case 3:
                          return (r = e.sent), e.abrupt('return', r)
                        case 7:
                          return (
                            (e.prev = 7),
                            (e.t0 = e.catch(0)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 10:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[0, 7]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Ae = Object(Re.c)(
          ''.concat(ze, '/updateMe'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.prev = 0), (e.next = 3), Fe(t)
                        case 3:
                          return (r = e.sent), e.abrupt('return', r)
                        case 7:
                          return (
                            (e.prev = 7),
                            (e.t0 = e.catch(0)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 10:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[0, 7]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        We = Object(Re.c)(
          ''.concat(ze, '/deleteMe'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.prev = 0), (e.next = 3), De()
                        case 3:
                          return (r = e.sent), e.abrupt('return', r)
                        case 7:
                          return (
                            (e.prev = 7),
                            (e.t0 = e.catch(0)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 10:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[0, 7]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Be = function (e) {
          return e.user.currentUser
        },
        Ve = Object(x.a)(m.a)({ padding: '0 20px' }),
        Ue = Object(x.a)(m.a)({
          display: 'flex',
          margin: '20px 0 10px 0',
          alignItems: 'center',
          maxWidth: 1e3,
        }),
        He = Object(x.a)('h2')({ marginBottom: 40 }),
        Ke = Object(x.a)(O.a)({ fontWeight: 700, minWidth: 272 }),
        Ze = Object(x.a)(O.a)({ width: 250 }),
        Ge = Object(x.a)('button')({
          backgroundColor: '#283237',
          color: '#ffffff',
          borderRadius: 4,
          border: 'none',
          outline: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }),
        qe = function () {
          var e = Object(z.c)(Be),
            t = Object(z.b)(),
            n = Object(h.n)(),
            r = Object(o.useState)(!1),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1],
            u = Object(o.useState)(!1),
            s = Object(N.a)(u, 2),
            l = s[0],
            d = s[1],
            f = Object(o.useState)(!1),
            j = Object(N.a)(f, 2),
            p = j[0],
            b = j[1],
            m = function () {
              i(!1)
            },
            x = (function () {
              var r = Object(F.a)(
                R.a.mark(function r() {
                  return R.a.wrap(function (r) {
                    for (;;)
                      switch ((r.prev = r.next)) {
                        case 0:
                          if (e) {
                            r.next = 2
                            break
                          }
                          return r.abrupt('return')
                        case 2:
                          b(!0)
                          try {
                            t(We()), n('/login')
                          } catch (a) {
                          } finally {
                            b(!1)
                          }
                          m()
                        case 5:
                        case 'end':
                          return r.stop()
                      }
                  }, r)
                }),
              )
              return function () {
                return r.apply(this, arguments)
              }
            })(),
            O = function () {
              d(!1)
            },
            v = (function () {
              var e = Object(F.a)(
                R.a.mark(function e(t, n) {
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              b(!0),
                              (e.prev = 1),
                              (e.next = 4),
                              Ne({ old_password: t, new_password: n })
                            )
                          case 4:
                            alert(
                              'Your password has been successfully changed.',
                            ),
                              O(),
                              (e.next = 11)
                            break
                          case 8:
                            ;(e.prev = 8),
                              (e.t0 = e.catch(1)),
                              alert('Failed to Change Password!')
                          case 11:
                            return (e.prev = 11), b(!1), e.finish(11)
                          case 14:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[1, 8, 11, 14]],
                  )
                }),
              )
              return function (t, n) {
                return e.apply(this, arguments)
              }
            })()
          return Object(I.jsxs)(Ve, {
            children: [
              Object(I.jsx)(me, {
                titleSubmit: 'Delete My Account',
                onClose: m,
                open: c,
                onSubmit: x,
                description: 'Delete account will erase all of your data.',
              }),
              Object(I.jsx)(je, { onSubmit: v, open: l, onClose: O }),
              Object(I.jsx)(He, { children: 'Account Profile' }),
              Object(I.jsxs)(Ue, {
                children: [
                  Object(I.jsx)(Ze, { children: 'Account ID' }),
                  Object(I.jsx)(Ke, {
                    children: null === e || void 0 === e ? void 0 : e.uid,
                  }),
                ],
              }),
              Object(I.jsxs)(Ue, {
                children: [
                  Object(I.jsx)(Ze, { children: 'Email' }),
                  Object(I.jsx)(Ke, {
                    children: null === e || void 0 === e ? void 0 : e.email,
                  }),
                ],
              }),
              Object(I.jsxs)(Ue, {
                sx: { justifyContent: 'space-between', mt: 10 },
                children: [
                  Object(I.jsx)(Ge, {
                    onClick: function () {
                      d(!0)
                    },
                    children: 'Change Password',
                  }),
                  Object(I.jsx)(Ge, {
                    onClick: function () {
                      i(!0)
                    },
                    children: 'Delete Account',
                  }),
                ],
              }),
              p && Object(I.jsx)(U, {}),
            ],
          })
        },
        Ye = function () {
          return Object(I.jsx)(m.a, {
            sx: { fontWeight: 600, fontSize: 18, mt: 4 },
            children: 'You account has been deleted.',
          })
        },
        Xe = n(1753),
        $e = Object(x.a)(m.a)({
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
        Je = Object(x.a)(m.a)({
          padding: 30,
          boxShadow: '2px 1px 3px 1px rgba(0,0,0,0.1)',
          borderRadius: 4,
        }),
        Qe = Object(x.a)(O.a)({
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 24,
        }),
        et = Object(x.a)('form')({}),
        tt = Object(x.a)(O.a)({ fontSize: 14 }),
        nt = Object(x.a)('span')({ color: 'red', fontSize: 14, marginLeft: 2 }),
        rt = Object(x.a)('input', {
          shouldForwardProp: function (e) {
            return 'error' !== e
          },
        })(function (e) {
          return {
            width: 250,
            height: 24,
            borderRadius: 4,
            border: '1px solid',
            borderColor: e.error ? 'red' : '#d9d9d9',
            padding: '5px 10px',
            marginBottom: 22,
            transition: 'all 0.3s',
            outline: 'none',
            ':focus, :hover': { borderColor: '#1677ff' },
          }
        }),
        at = Object(x.a)(O.a)(function (e) {
          return {
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.65)',
            marginTop: e.theme.spacing(1),
          }
        }),
        ct = Object(x.a)(b.b)({ marginLeft: 6, color: '#1892d1' }),
        it = Object(x.a)('button')({
          backgroundColor: '#283237',
          color: '#ffffff',
          borderRadius: 4,
          border: 'none',
          outline: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }),
        ot = Object(x.a)(O.a)({
          fontSize: 12,
          color: 'red',
          position: 'absolute',
          bottom: 4,
        }),
        ut = function () {
          var e = Object(h.n)(),
            t = Object(z.b)(),
            n = Object(o.useState)(!1),
            r = Object(N.a)(n, 2),
            a = r[0],
            c = r[1],
            i = Object(o.useState)({ email: '', password: '' }),
            u = Object(N.a)(i, 2),
            s = u[0],
            l = u[1],
            d = Object(o.useState)({ email: '', password: '' }),
            f = Object(N.a)(d, 2),
            j = f[0],
            p = f[1],
            b = (function () {
              var n = Object(F.a)(
                R.a.mark(function n(r) {
                  return R.a.wrap(function (n) {
                    for (;;)
                      switch ((n.prev = n.next)) {
                        case 0:
                          if ((r.preventDefault(), !x())) {
                            n.next = 4
                            break
                          }
                          return n.abrupt('return')
                        case 4:
                          c(!0),
                            t(Le(j))
                              .unwrap()
                              .then(function (n) {
                                t(Me())
                                  .unwrap()
                                  .then(function (t) {
                                    e('/')
                                  })
                              })
                              .catch(function (e) {
                                l({
                                  email: 'Email or password is wrong',
                                  password: '',
                                })
                              })
                              .finally(function () {
                                c(!1)
                              })
                        case 6:
                        case 'end':
                          return n.stop()
                      }
                  }, n)
                }),
              )
              return function (e) {
                return n.apply(this, arguments)
              }
            })(),
            x = function () {
              var e = { email: '', password: '' }
              return (
                j.email || (e.email = 'This field is required'),
                j.password || (e.password = 'This field is required'),
                l(e),
                e.password || e.email
              )
            },
            O = function (e) {
              var t = e.target,
                n = t.name,
                r = t.value
              p(Object(K.a)(Object(K.a)({}, j), {}, Object(H.a)({}, n, r))),
                l(
                  Object(K.a)(
                    Object(K.a)({}, s),
                    {},
                    Object(H.a)({}, n, r ? '' : 'This field is required'),
                  ),
                )
            }
          return Object(I.jsxs)($e, {
            children: [
              Object(I.jsxs)(Je, {
                children: [
                  Object(I.jsx)(Qe, {
                    'data-testid': 'title',
                    children: 'Sign in to your account',
                  }),
                  Object(I.jsxs)(et, {
                    autoComplete: 'off',
                    onSubmit: b,
                    children: [
                      Object(I.jsxs)(m.a, {
                        sx: { position: 'relative' },
                        children: [
                          Object(I.jsxs)(tt, {
                            children: [
                              'Email',
                              Object(I.jsx)(nt, { children: '*' }),
                            ],
                          }),
                          Object(I.jsx)(rt, {
                            'data-testid': 'email',
                            autoComplete: 'off',
                            error: !!s.email,
                            name: 'email',
                            onChange: O,
                            value: j.email,
                            placeholder: 'Enter your email',
                          }),
                          Object(I.jsx)(ot, {
                            'data-testid': 'error-email',
                            children: s.email,
                          }),
                        ],
                      }),
                      Object(I.jsxs)(m.a, {
                        sx: { position: 'relative' },
                        children: [
                          Object(I.jsxs)(tt, {
                            children: [
                              'Password',
                              Object(I.jsx)(nt, { children: '*' }),
                            ],
                          }),
                          Object(I.jsx)(rt, {
                            'data-testid': 'password',
                            autoComplete: 'off',
                            error: !!s.password,
                            onChange: O,
                            name: 'password',
                            type: 'password',
                            value: j.password,
                            placeholder: 'Enter your password',
                          }),
                          Object(I.jsx)(ot, {
                            'data-testid': 'error-password',
                            children: s.password,
                          }),
                        ],
                      }),
                      Object(I.jsxs)(at, {
                        children: [
                          'Forgot your password?',
                          Object(I.jsx)(ct, {
                            to: '/reset-password',
                            children: 'Reset password',
                          }),
                        ],
                      }),
                      Object(I.jsx)(Xe.a, {
                        flexDirection: 'row',
                        gap: 2,
                        mt: 3,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        children: Object(I.jsx)(it, {
                          'data-testid': 'button-submit',
                          type: 'submit',
                          children: 'SIGN IN',
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              a && Object(I.jsx)(U, {}),
            ],
          })
        },
        st = n(1778),
        lt = Object(x.a)(m.a)({
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
        dt = Object(x.a)(m.a)({
          padding: 30,
          boxShadow: '2px 1px 3px 1px rgba(0,0,0,0.1)',
          borderRadius: 4,
        }),
        ft = Object(x.a)(O.a)({
          fontSize: 22,
          textAlign: 'center',
          fontWeight: 600,
        }),
        jt = Object(x.a)(O.a)({
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 12,
          color: 'rgba(0, 0, 0, 0.65)',
        }),
        pt = Object(x.a)(st.a)({
          fontSize: 12,
          '&:hover': { cursor: 'pointer' },
        }),
        bt = Object(x.a)('form')({}),
        ht = Object(x.a)(O.a)({ fontSize: 14 }),
        mt = Object(x.a)('span')({ color: 'red', fontSize: 14, marginLeft: 2 }),
        xt = Object(x.a)('input', {
          shouldForwardProp: function (e) {
            return 'error' !== e
          },
        })(function (e) {
          return {
            width: 250,
            height: 24,
            borderRadius: 4,
            border: '1px solid',
            borderColor: e.error ? 'red' : '#d9d9d9',
            padding: '5px 10px',
            marginBottom: 22,
            transition: 'all 0.3s',
            outline: 'none',
            ':focus, :hover': { borderColor: '#1677ff' },
          }
        }),
        Ot = Object(x.a)('button')({
          backgroundColor: '#283237',
          color: '#ffffff',
          borderRadius: 4,
          border: 'none',
          outline: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }),
        vt = Object(x.a)(O.a)({
          fontSize: 12,
          color: 'red',
          position: 'absolute',
          bottom: 4,
        }),
        gt = function () {
          var e = Object(h.n)(),
            t = Object(o.useState)(!1),
            n = Object(N.a)(t, 2),
            r = n[0],
            a = n[1],
            c = Object(o.useState)({ email: '' }),
            i = Object(N.a)(c, 2),
            u = i[0],
            s = i[1],
            l = Object(o.useState)({ email: '' }),
            d = Object(N.a)(l, 2),
            f = d[0],
            j = d[1],
            p = (function () {
              var e = Object(F.a)(
                R.a.mark(function e(t) {
                  var n
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (
                              (t.preventDefault(), (n = x()), !u.email && !n)
                            ) {
                              e.next = 4
                              break
                            }
                            return e.abrupt('return')
                          case 4:
                            return (
                              a(!0), (e.prev = 5), (e.next = 8), ke(f.email)
                            )
                          case 8:
                            setTimeout(function () {
                              alert(
                                " You'll receive a link to reset your password at ".concat(
                                  f.email,
                                  '. Please check your mail!',
                                ),
                              )
                            }, 300),
                              (e.next = 14)
                            break
                          case 11:
                            ;(e.prev = 11),
                              (e.t0 = e.catch(5)),
                              setTimeout(function () {
                                alert('Email does not exists!')
                              }, 300)
                          case 14:
                            return (e.prev = 14), a(!1), e.finish(14)
                          case 17:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[5, 11, 14, 17]],
                  )
                }),
              )
              return function (t) {
                return e.apply(this, arguments)
              }
            })(),
            b = function (e) {
              return e
                ? e.length > 255
                  ? 'The text may not be longer than 255 characters'
                  : Y.test(e)
                  ? ''
                  : 'The email is invalid'
                : 'This field is required'
            },
            x = function () {
              var e = { email: '' }
              return (e.email = b(f.email)), s(e), e.email
            }
          return Object(I.jsxs)(lt, {
            children: [
              Object(I.jsxs)(dt, {
                children: [
                  Object(I.jsx)(ft, { children: 'Forgot password?' }),
                  Object(I.jsx)(jt, {
                    children: "No worries, we'll send you reset instructions.",
                  }),
                  Object(I.jsxs)(bt, {
                    autoComplete: 'off',
                    onSubmit: p,
                    children: [
                      Object(I.jsxs)(m.a, {
                        sx: { position: 'relative' },
                        children: [
                          Object(I.jsxs)(ht, {
                            children: [
                              'Email',
                              Object(I.jsx)(mt, { children: '*' }),
                            ],
                          }),
                          Object(I.jsx)(xt, {
                            autoComplete: 'off',
                            error: !!u.email,
                            name: 'email',
                            onChange: function (e) {
                              var t = e.target,
                                n = t.name,
                                r = t.value,
                                a = b(r)
                              j(
                                Object(K.a)(
                                  Object(K.a)({}, f),
                                  {},
                                  Object(H.a)({}, n, r),
                                ),
                              ),
                                s(
                                  Object(K.a)(
                                    Object(K.a)({}, u),
                                    {},
                                    Object(H.a)({}, n, a),
                                  ),
                                )
                            },
                            value: f.email,
                            placeholder: 'Enter your email',
                          }),
                          Object(I.jsx)(vt, { children: u.email }),
                        ],
                      }),
                      Object(I.jsxs)(Xe.a, {
                        flexDirection: 'row',
                        gap: 2,
                        mt: 3,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        children: [
                          Object(I.jsx)(pt, {
                            onClick: function () {
                              return e('/login')
                            },
                            children: 'Back to SIGN IN',
                          }),
                          Object(I.jsx)(Ot, {
                            type: 'submit',
                            children: 'Reset Password',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              r && Object(I.jsx)(U, {}),
            ],
          })
        },
        yt = n(393),
        wt = function (e) {
          return e.workspace.currentWorkspace.selectedTab
        },
        It = function (e) {
          return e.workspace.currentWorkspace.workspaceId
        },
        kt = function (e) {
          return e.workspace.workspaces
        },
        Ct = function (e) {
          return e.workspace.loading
        },
        St = [
          {
            field: 'workspace_id',
            headerName: 'ID',
            renderCell: function (e) {
              return Object(I.jsx)(b.b, {
                to: '/workspaces/'.concat(e.value),
                children: e.value,
              })
            },
          },
        ],
        _t = Object(x.a)(m.a)(function (e) {
          return {
            width: '100%',
            padding: e.theme.spacing(2),
            overflow: 'auto',
          }
        }),
        Pt = Object(x.a)('h1')(function (e) {
          e.theme
          return {}
        }),
        Tt = function () {
          var e = Object(z.c)(kt),
            t = Object(z.c)(Ct)
          return Object(I.jsxs)(_t, {
            children: [
              Object(I.jsx)(Pt, { children: 'Workspaces' }),
              Object(I.jsx)(yt.a, {
                autoHeight: !0,
                checkboxSelection: !0,
                rows: e.map(function (e) {
                  return { id: e.workspace_id, workspace_id: e.workspace_id }
                }),
                columns: St,
              }),
              t ? Object(I.jsx)(U, {}) : null,
            ],
          })
        },
        Et = n(41)
      function Ft(e, t) {
        for (var n = null, r = 0, a = Object.values(t); r < a.length; r++) {
          var c = a[r]
          if (
            (Nt(c) ? c.path === e && (n = c) : (n = Ft(e, c.children)),
            null != n)
          )
            break
        }
        return n
      }
      function Nt(e) {
        return 'child' === e.type
      }
      function Dt(e, t) {
        var n = {}
        return (
          Object.entries(e).forEach(function (e) {
            var r = Object(N.a)(e, 2),
              a = r[0],
              c = r[1],
              i = null !== t && void 0 !== t ? t : []
            !(function (e) {
              return null !== e && 'object' === typeof e && !Array.isArray(e)
            })(c)
              ? (n[a] = {
                  type: 'child',
                  value: c,
                  path: i.concat([a]).join('/'),
                })
              : (i.push(a), (n[a] = { type: 'parent', children: Dt(c, i) }))
          }),
          n
        )
      }
      var Rt = function (e) {
          return function (t) {
            return t.algorithmNode[e]
          }
        },
        zt = function (e) {
          return function (t) {
            return Rt(e)(t).name
          }
        },
        Lt = function (e) {
          return function (t) {
            return Rt(e)(t).params
          }
        },
        Mt = function (e) {
          return (
            0 ===
            Object.keys(
              (function (e) {
                return e.algorithmNode
              })(e),
            ).length
          )
        },
        At = 'flowElement',
        Wt = 'input',
        Bt = 'algorithm'
      function Vt(e) {
        return null != e && Object(Et.k)(e) && null != e.data
      }
      function Ut(e) {
        var t
        return (
          Vt(e) &&
          (null === (t = e.data) || void 0 === t ? void 0 : t.type) === Bt
        )
      }
      function Ht(e) {
        return Array.isArray(e)
          ? 0 === e.length
            ? ''
            : 1 === e.length
            ? Kt(e[0])
            : Kt(e[0]) + ' ... and '.concat(e.length - 1, ' files')
          : Kt(e)
      }
      function Kt(e) {
        return e.split('/').reverse()[0]
      }
      var Zt,
        Gt = function (e) {
          return e.flowElement.flowElements
        },
        qt = function (e) {
          return e.flowElement.flowPosition
        },
        Yt = function (e) {
          return function (t) {
            return Gt(t)
              .filter(Vt)
              .find(function (t) {
                return t.id === e
              })
          }
        },
        Xt = function (e) {
          return function (t) {
            var n, r
            return null === (n = Yt(e)(t)) ||
              void 0 === n ||
              null === (r = n.data) ||
              void 0 === r
              ? void 0
              : r.label
          }
        },
        $t = function (e) {
          return e.nwb
        },
        Jt = function (e) {
          return Object.keys($t(e).params)
        },
        Qt = function (e) {
          return function (t) {
            return $t(t).params[e]
          }
        },
        en = function (e) {
          return function (t) {
            var n = $t(t).params
            if (null != n) {
              var r = Ft(e, n)
              return null === r || void 0 === r ? void 0 : r.value
            }
            throw new Error('Param is null')
          }
        },
        tn = 'pipeline',
        nn = 'StartUninitialized',
        rn = 'StartPending',
        an = 'StartError',
        cn = 'StartSuccess',
        on = 'Finished',
        un = 'Aborted',
        sn = 'Canceled',
        ln = 'success',
        dn = 'error',
        fn = 'pending',
        jn = { RUN_NEW: 1, RUN_ALREADY: 2 },
        pn =
          ((Zt = {}),
          Object(H.a)(Zt, jn.RUN_NEW, 'RUN ALL'),
          Object(H.a)(Zt, jn.RUN_ALREADY, 'RUN'),
          Zt),
        bn = 'displayData',
        hn = 'timeSeries',
        mn = 'heatMap',
        xn = 'image',
        On = 'csv',
        vn = 'roi',
        gn = 'scatter',
        yn = 'bar',
        wn = 'hdf5',
        In = 'html',
        kn = 'fluo',
        Cn = 'behavior'
      function Sn(e) {
        switch (e) {
          case 'images':
            return xn
          case 'timeseries':
            return hn
          case 'heatmap':
            return mn
          case 'roi':
            return vn
          case 'scatter':
            return gn
          case 'bar':
            return yn
          case 'html':
            return In
          default:
            throw new Error('failed to map dataType: '.concat(e))
        }
      }
      function _n(e) {
        return e.status === fn
      }
      function Pn(e) {
        return e.status === ln
      }
      function Tn(e) {
        return e.status === cn || e.status === on || e.status === un
      }
      function En(e) {
        var t = {}
        return (
          Object.values(e.nodeDict)
            .filter(function (e) {
              var t = e.data
              return (null === t || void 0 === t ? void 0 : t.type) === Bt
            })
            .forEach(function (e) {
              var n,
                r = e.id,
                a = e.data
              t[r] = {
                status: fn,
                name:
                  null !==
                    (n = null === a || void 0 === a ? void 0 : a.label) &&
                  void 0 !== n
                    ? n
                    : '',
              }
            }),
          t
        )
      }
      function Fn(e) {
        var t = {}
        return (
          Object.entries(e).forEach(function (e) {
            var n = Object(N.a)(e, 2),
              r = n[0],
              a = n[1]
            t[r] = { path: a.path, type: Sn(a.type) }
          }),
          t
        )
      }
      var Nn = function (e) {
          var t
          return null === (t = e.pipeline.currentPipeline) || void 0 === t
            ? void 0
            : t.uid
        },
        Dn = function (e) {
          return e.pipeline.run
        },
        Rn = function (e) {
          return e.pipeline.runBtn
        },
        zn = function (e) {
          var t = Dn(e)
          return Tn(t)
            ? Object.entries(t.runResult)
                .map(function (e) {
                  var t = Object(N.a)(e, 2)
                  return { nodeId: t[0], nodeResult: t[1] }
                })
                .filter(Ln)
                .map(function (e) {
                  return e.nodeId
                })
            : []
        }
      function Ln(e) {
        return _n(e.nodeResult)
      }
      var Mn = function (e) {
          return Dn(e).status
        },
        An = function (e) {
          return Dn(e).status === sn
        },
        Wn = function (e) {
          return Dn(e).status === cn
        }
      function Bn(e) {
        return Pn(e.nodeResult)
      }
      var Vn = function (e) {
          return function (t) {
            var n = Dn(t)
            return Tn(n) && Object.keys(n.runResult).includes(e)
              ? n.runResult[e].status
              : null
          }
        },
        Un = function (e) {
          return function (t) {
            var n = Dn(t)
            if (Tn(n)) {
              var r = n.runResult[e]
              if (Object.keys(n.runResult).includes(e) && Pn(r))
                return r.outputPaths
            }
            throw new Error('key error. nodeId:'.concat(e))
          }
        },
        Hn = function (e) {
          return (function (e) {
            return e.snakemake
          })(e).params
        },
        Kn = function (e) {
          return Object.keys(Hn(e))
        },
        Zn = function (e) {
          return function (t) {
            return Hn(t)[e]
          }
        },
        Gn = function (e) {
          return function (t) {
            var n = Hn(t)
            if (null != n) {
              var r = Ft(e, n)
              return null === r || void 0 === r ? void 0 : r.value
            }
            throw new Error('Param is null')
          }
        },
        qn = 'inputNode',
        Yn = 'csv',
        Xn = 'image',
        $n = 'hdf5',
        Jn = 'fluo',
        Qn = 'behavior'
      function er(e) {
        return e.fileType === Yn
      }
      function tr(e) {
        return e.fileType === $n
      }
      var nr = function (e) {
          return function (t) {
            return t.inputNode[e]
          }
        },
        rr = function (e) {
          return function (t) {
            return Object.keys(t.inputNode).includes(e)
          }
        },
        ar = function (e) {
          return function (t) {
            var n = nr(e)(t)
            if (er(n)) return n.selectedFilePath
            throw new Error('invaid input node type')
          }
        },
        cr = function (e) {
          return function (t) {
            var n = nr(e)(t)
            if (n.fileType === Xn) return n.selectedFilePath
            throw new Error('invaid input node type')
          }
        },
        ir = function (e) {
          return function (t) {
            var n = nr(e)(t)
            if (tr(n)) return n.selectedFilePath
            throw new Error('invaid input node type')
          }
        },
        or = function (e) {
          return (
            0 === Object.keys(e.inputNode).length ||
            Object.values(e.inputNode).filter(function (e) {
              if (tr(e)) return null == e.selectedFilePath || null == e.hdf5Path
              var t = e.selectedFilePath
              return Array.isArray(t) ? 0 === t.length : null == t
            }).length > 0
          )
        },
        ur = function (e) {
          return function (t) {
            var n = nr(e)(t)
            if (er(n)) return n.param
            throw new Error(
              'The InputNode is not CsvInputNode. (nodeId: '.concat(e, ')'),
            )
          }
        },
        sr = function (e) {
          return function (t) {
            var n = nr(e)(t)
            return tr(n) ? n.hdf5Path : void 0
          }
        },
        lr = function (e) {
          var t = (function (e) {
            return $t(e).params
          })(e)
          return {
            nwbParam: t,
            snakemakeParam: Hn(e),
            edgeDict: jr(e),
            nodeDict: fr(e),
            forceRunList: dr(e),
          }
        },
        dr = function (e) {
          return Gt(e)
            .filter(Ut)
            .filter(function (t) {
              var n,
                r = ((n = t.id),
                function (e) {
                  return Rt(n)(e).isUpdated
                })(e),
                a = Vn(t.id)(e)
              return r || a === dn
            })
            .map(function (t) {
              return { nodeId: t.id, name: zt(t.id)(e) }
            })
        },
        fr = function (e) {
          var t = Gt(e),
            n = {}
          return (
            t.filter(Vt).forEach(function (t) {
              if (Ut(t)) {
                var r,
                  a,
                  c,
                  i = null !== (r = Lt(t.id)(e)) && void 0 !== r ? r : {},
                  o = ((h = t.id),
                  function (e) {
                    return Rt(h)(e).functionPath
                  })(e),
                  u = Object(K.a)(
                    Object(K.a)({}, t),
                    {},
                    {
                      data: Object(K.a)(
                        Object(K.a)({}, t.data),
                        {},
                        {
                          label:
                            null !==
                              (a =
                                null === (c = t.data) || void 0 === c
                                  ? void 0
                                  : c.label) && void 0 !== a
                              ? a
                              : '',
                          type: Bt,
                          path: o,
                          param: i,
                        },
                      ),
                    },
                  )
                n[t.id] = u
              } else {
                var s,
                  l,
                  d = (function (e) {
                    return function (t) {
                      return nr(e)(t).selectedFilePath
                    }
                  })(t.id)(e),
                  f = (function (e) {
                    return function (t) {
                      return nr(e)(t).fileType
                    }
                  })(t.id)(e),
                  j = (function (e) {
                    return function (t) {
                      return nr(e)(t).param
                    }
                  })(t.id)(e),
                  p = sr(t.id)(e),
                  b = Object(K.a)(
                    Object(K.a)({}, t),
                    {},
                    {
                      data: Object(K.a)(
                        Object(K.a)({}, t.data),
                        {},
                        {
                          label:
                            null !==
                              (s =
                                null === (l = t.data) || void 0 === l
                                  ? void 0
                                  : l.label) && void 0 !== s
                              ? s
                              : '',
                          type: Wt,
                          path: null !== d && void 0 !== d ? d : '',
                          param: j,
                          hdf5Path: p,
                          fileType: f,
                        },
                      ),
                    },
                  )
                n[t.id] = b
              }
              var h
            }),
            n
          )
        },
        jr = function (e) {
          var t = {}
          return (
            Gt(e)
              .filter(Et.j)
              .forEach(function (e) {
                t[e.id] = e
              }),
            t
          )
        }
      function pr(e, t) {
        return br.apply(this, arguments)
      }
      function br() {
        return (br = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2), Te.post(''.concat(_e, '/run/').concat(t), n)
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function hr(e, t, n) {
        return mr.apply(this, arguments)
      }
      function mr() {
        return (mr = Object(F.a)(
          R.a.mark(function e(t, n, r) {
            var a
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(
                        ''.concat(_e, '/run/').concat(t, '/').concat(n),
                        r,
                      )
                    )
                  case 2:
                    return (a = e.sent), e.abrupt('return', a.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function xr(e) {
        return Or.apply(this, arguments)
      }
      function Or() {
        return (Or = Object(F.a)(
          R.a.mark(function e(t) {
            var n, r, a, c
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (n = t.workspaceId),
                      (r = t.uid),
                      (a = t.pendingNodeIdList),
                      (e.next = 3),
                      Te.post(
                        ''.concat(_e, '/run/result/').concat(n, '/').concat(r),
                        { pendingNodeIdList: a },
                      )
                    )
                  case 3:
                    return (c = e.sent), e.abrupt('return', c.data)
                  case 5:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var vr = Object(Re.c)(
          ''.concat(tn, '/run'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (((r = t.runPostData), !(a = It(n.getState())))) {
                            e.next = 15
                            break
                          }
                          return (e.prev = 3), (e.next = 6), pr(a, r)
                        case 6:
                          return (c = e.sent), e.abrupt('return', c)
                        case 10:
                          return (
                            (e.prev = 10),
                            (e.t0 = e.catch(3)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 13:
                          e.next = 16
                          break
                        case 15:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue('workspace id does not exist.'),
                          )
                        case 16:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[3, 10]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        gr = Object(Re.c)(
          ''.concat(tn, '/runByCurrentUid'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c, i
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (
                            ((r = t.runPostData),
                            (a = It(n.getState())),
                            (c = Nn(n.getState())),
                            !a || null == c)
                          ) {
                            e.next = 16
                            break
                          }
                          return (e.prev = 4), (e.next = 7), hr(a, c, r)
                        case 7:
                          return (i = e.sent), e.abrupt('return', i)
                        case 11:
                          return (
                            (e.prev = 11),
                            (e.t0 = e.catch(4)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 14:
                          e.next = 17
                          break
                        case 16:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue(
                              'workspaceId or currentUid dose not exist.',
                            ),
                          )
                        case 17:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[4, 11]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        yr = Object(Re.c)(
          ''.concat(tn, '/pollRunResult'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c, i
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (
                            ((r = t.uid),
                            (a = zn(n.getState())),
                            !(c = It(n.getState())))
                          ) {
                            e.next = 16
                            break
                          }
                          return (
                            (e.prev = 4),
                            (e.next = 7),
                            xr({ workspaceId: c, uid: r, pendingNodeIdList: a })
                          )
                        case 7:
                          return (i = e.sent), e.abrupt('return', i)
                        case 11:
                          return (
                            (e.prev = 11),
                            (e.t0 = e.catch(4)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 14:
                          e.next = 17
                          break
                        case 16:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue('workspace id does not exist'),
                          )
                        case 17:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[4, 11]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        )
      function wr(e) {
        return Ir.apply(this, arguments)
      }
      function Ir() {
        return (Ir = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/experiments/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function kr(e, t) {
        return Cr.apply(this, arguments)
      }
      function Cr() {
        return (Cr = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.delete(
                        ''.concat(_e, '/experiments/').concat(t, '/').concat(n),
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function Sr(e, t) {
        return _r.apply(this, arguments)
      }
      function _r() {
        return (_r = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(''.concat(_e, '/experiments/delete/').concat(t), {
                        uidList: n,
                      })
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function Pr(e, t) {
        return Tr.apply(this, arguments)
      }
      function Tr() {
        return (Tr = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(
                        ''
                          .concat(_e, '/experiments/import/')
                          .concat(t, '/')
                          .concat(n),
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function Er(e, t, n) {
        return Fr.apply(this, arguments)
      }
      function Fr() {
        return (Fr = Object(F.a)(
          R.a.mark(function e(t, n, r) {
            var a, c
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (a =
                        null != r
                          ? ''
                              .concat(_e, '/experiments/download/nwb/')
                              .concat(t, '/')
                              .concat(n, '/')
                              .concat(r)
                          : ''
                              .concat(_e, '/experiments/download/nwb/')
                              .concat(t, '/')
                              .concat(n)),
                      (e.next = 3),
                      Te.get(a, { responseType: 'blob' })
                    )
                  case 3:
                    return (c = e.sent), e.abrupt('return', c.data)
                  case 5:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function Nr(e, t) {
        return Dr.apply(this, arguments)
      }
      function Dr() {
        return (Dr = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(
                        ''
                          .concat(_e, '/experiments/download/config/')
                          .concat(t, '/')
                          .concat(n),
                        { responseType: 'blob' },
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function Rr(e, t, n) {
        return zr.apply(this, arguments)
      }
      function zr() {
        return (zr = Object(F.a)(
          R.a.mark(function e(t, n, r) {
            var a
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.patch(
                        ''
                          .concat(_e, '/experiments/')
                          .concat(t, '/')
                          .concat(n, '/rename'),
                        { new_name: r },
                      )
                    )
                  case 2:
                    return (a = e.sent), e.abrupt('return', a.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Lr = 'experiments',
        Mr = Object(Re.c)(
          ''.concat(Lr, '/getExperiments'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!(r = It(n.getState()))) {
                            e.next = 14
                            break
                          }
                          return (e.prev = 2), (e.next = 5), wr(r)
                        case 5:
                          return (a = e.sent), e.abrupt('return', a)
                        case 9:
                          return (
                            (e.prev = 9),
                            (e.t0 = e.catch(2)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 12:
                          e.next = 15
                          break
                        case 14:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue('workspace id does not exist.'),
                          )
                        case 15:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[2, 9]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Ar = Object(Re.c)(
          ''.concat(Lr, '/deleteExperimentByUid'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!(r = It(n.getState()))) {
                            e.next = 14
                            break
                          }
                          return (e.prev = 2), (e.next = 5), kr(r, t)
                        case 5:
                          return (a = e.sent), e.abrupt('return', a)
                        case 9:
                          return (
                            (e.prev = 9),
                            (e.t0 = e.catch(2)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 12:
                          e.next = 15
                          break
                        case 14:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue('workspace id does not exist.'),
                          )
                        case 15:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[2, 9]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Wr = Object(Re.c)(
          ''.concat(Lr, '/deleteExperimentByList'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!(r = It(n.getState()))) {
                            e.next = 14
                            break
                          }
                          return (e.prev = 2), (e.next = 5), Sr(r, t)
                        case 5:
                          return (a = e.sent), e.abrupt('return', a)
                        case 9:
                          return (
                            (e.prev = 9),
                            (e.t0 = e.catch(2)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 12:
                          e.next = 15
                          break
                        case 14:
                          return e.abrupt(
                            'return',
                            n.rejectWithValue('workspace id does not exist.'),
                          )
                        case 15:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[2, 9]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Br = Object(Re.c)(
          ''.concat(Lr, '/importExperimentByUid'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = t.workspaceId),
                            (a = t.uid),
                            (e.prev = 1),
                            (e.next = 4),
                            Pr(r, a)
                          )
                        case 4:
                          return (c = e.sent), e.abrupt('return', c)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Vr = { run: { status: nn }, runBtn: jn.RUN_NEW },
        Ur = Object(Re.d)({
          name: tn,
          initialState: Vr,
          reducers: {
            cancelPipeline: function (e) {
              e.run.status = sn
            },
            setRunBtnOption: function (e, t) {
              e.runBtn = t.payload.runBtnOption
            },
            clearCurrentPipeline: function () {
              return Vr
            },
          },
          extraReducers: function (e) {
            e.addCase(yr.fulfilled, function (e, t) {
              e.run.status === cn &&
                ((e.run.runResult = Object(K.a)(
                  Object(K.a)({}, e.run.runResult),
                  (function (e) {
                    var t = {}
                    return (
                      Object.entries(e).forEach(function (e) {
                        var n = Object(N.a)(e, 2),
                          r = n[0],
                          a = n[1],
                          c = a.outputPaths
                        'success' === a.status && null != c
                          ? (t[r] = {
                              status: ln,
                              message: a.message,
                              name: a.name,
                              outputPaths: Fn(c),
                            })
                          : (t[r] = {
                              status: dn,
                              message: a.message,
                              name: a.name,
                            })
                      }),
                      t
                    )
                  })(t.payload),
                )),
                0 === Object.values(e.run.runResult).filter(_n).length &&
                  (e.run.status = on))
            })
              .addCase(yr.rejected, function (e, t) {
                e.run.status = un
              })
              .addCase(Br.fulfilled, function (e, t) {
                ;(e.currentPipeline = { uid: t.meta.arg.uid }),
                  (e.runBtn = jn.RUN_ALREADY),
                  (e.run = { status: nn })
              })
              .addMatcher(
                Object(Re.e)(vr.pending, gr.pending),
                function (e, t) {
                  e.run = { status: rn }
                },
              )
              .addMatcher(
                Object(Re.e)(vr.fulfilled, gr.fulfilled),
                function (e, t) {
                  var n = t.meta.arg.runPostData,
                    r = t.payload
                  ;(e.run = {
                    uid: r,
                    status: cn,
                    runResult: En(Object(K.a)({ name: '' }, n)),
                    runPostData: Object(K.a)({ name: '' }, n),
                  }),
                    (e.currentPipeline = { uid: t.payload })
                },
              )
              .addMatcher(
                Object(Re.e)(vr.rejected, gr.rejected),
                function (e, t) {
                  e.run = { status: an }
                },
              )
          },
        }),
        Hr = Ur.actions,
        Kr = Hr.cancelPipeline,
        Zr = Hr.setRunBtnOption,
        Gr = Hr.clearCurrentPipeline,
        qr = Ur.reducer
      var Yr = n(18),
        Xr = n(1769),
        $r = n(1791),
        Jr = n(1786),
        Qr = n(1788),
        ea = n(1757),
        ta = n(556),
        na = n(1792),
        ra = n(1787),
        aa = n(1785),
        ca = n(1697),
        ia = n(565),
        oa = n(851),
        ua = n.n(oa),
        sa = n(850),
        la = n.n(sa),
        da = n(849),
        fa = n.n(da),
        ja = n(399),
        pa = n.n(ja),
        ba = n(1694),
        ha = n(1789),
        ma = n(1790),
        xa = n(1758),
        Oa = n(1775),
        va = n(1698),
        ga = function (e) {
          return e.experiments
        },
        ya = function (e) {
          return 'uninitialized' === ga(e).status
        },
        wa = function (e) {
          return 'fulfilled' === ga(e).status
        },
        Ia = function (e) {
          return 'error' === ga(e).status
        },
        ka = function (e) {
          var t = ga(e)
          if ('error' === t.status) return t.message
          throw new Error('experiments status is not error')
        },
        Ca = function (e) {
          var t = ga(e)
          if ('fulfilled' === t.status) return t.experimentList
          throw new Error('experiments status is not fulfilled')
        },
        Sa = function (e) {
          return function (t) {
            return Ca(t)[e]
          }
        },
        _a = function (e) {
          return function (t) {
            return Sa(e)(t).name
          }
        },
        Pa = function (e, t) {
          return function (n) {
            return Ca(n)[e].functions[t]
          }
        },
        Ta = n(845),
        Ea = n.n(Ta),
        Fa = n(844),
        Na = n.n(Fa),
        Da = n(846),
        Ra = n.n(Da),
        za = u.a.memo(function (e) {
          switch (e.status) {
            case 'error':
              return Object(I.jsx)(Na.a, { color: 'error' })
            case 'success':
              return Object(I.jsx)(Ea.a, { color: 'success' })
            case 'running':
              return Object(I.jsx)(Ra.a, { color: 'inherit' })
          }
        })
      function La(e, t) {
        return (
          e === t ||
          (e.length === t.length &&
            e.every(function (e, n) {
              return e === t[n]
            }))
        )
      }
      function Ma(e, t) {
        return (
          e === t ||
          (e.length === t.length &&
            e.every(function (e, n) {
              return La(e, t[n])
            }))
        )
      }
      var Aa = n(557),
        Wa = n.n(Aa),
        Ba = u.a.memo(function (e) {
          var t = e.name,
            n = e.nodeId,
            r = e.hasNWB,
            a = Object(z.c)(It),
            c = u.a.useContext(fu),
            i = Object(o.useRef)(null),
            s = Object(o.useState)(),
            l = Object(N.a)(s, 2),
            f = l[0],
            j = l[1],
            p = (function () {
              var e = Object(F.a)(
                R.a.mark(function e() {
                  var t, r, o
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (a) {
                              e.next = 2
                              break
                            }
                            return e.abrupt('return')
                          case 2:
                            return (e.prev = 2), (e.next = 5), Er(a, c, n)
                          case 5:
                            ;(r = e.sent),
                              (o = URL.createObjectURL(new Blob([r]))),
                              j(o),
                              null === (t = i.current) ||
                                void 0 === t ||
                                t.click(),
                              URL.revokeObjectURL(o),
                              (e.next = 15)
                            break
                          case 12:
                            throw (
                              ((e.prev = 12),
                              (e.t0 = e.catch(2)),
                              new Error('Download Error'))
                            )
                          case 15:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[2, 12]],
                  )
                }),
              )
              return function () {
                return e.apply(this, arguments)
              }
            })()
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                onClick: p,
                color: 'primary',
                disabled: !r,
                children: Object(I.jsx)(Wa.a, {}),
              }),
              Object(I.jsx)('a', {
                href: f,
                download: ''.concat(t, '.nwb'),
                className: 'hidden',
                ref: i,
                children: ' ',
              }),
            ],
          })
        }),
        Va = u.a.memo(function () {
          var e = Object(z.c)(It),
            t = u.a.useContext(fu),
            n = Object(o.useRef)(null),
            r = Object(o.useState)(),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1],
            s = (function () {
              var r = Object(F.a)(
                R.a.mark(function r() {
                  var a, c, o
                  return R.a.wrap(
                    function (r) {
                      for (;;)
                        switch ((r.prev = r.next)) {
                          case 0:
                            return (r.prev = 0), (r.next = 3), Nr(e, t)
                          case 3:
                            ;(c = r.sent),
                              (o = URL.createObjectURL(new Blob([c]))),
                              i(o),
                              null === (a = n.current) ||
                                void 0 === a ||
                                a.click(),
                              URL.revokeObjectURL(o),
                              (r.next = 13)
                            break
                          case 10:
                            throw (
                              ((r.prev = 10),
                              (r.t0 = r.catch(0)),
                              new Error('Download Error'))
                            )
                          case 13:
                          case 'end':
                            return r.stop()
                        }
                    },
                    r,
                    null,
                    [[0, 10]],
                  )
                }),
              )
              return function () {
                return r.apply(this, arguments)
              }
            })()
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                onClick: s,
                children: Object(I.jsx)(Wa.a, { color: 'primary' }),
              }),
              Object(I.jsx)('a', {
                href: c,
                download: 'config.yaml',
                className: 'hidden',
                ref: n,
                children: ' ',
              }),
            ],
          })
        }),
        Ua = u.a.memo(function (e) {
          var t = e.open
          return Object(I.jsx)(aa.a, {
            children: Object(I.jsx)(ea.a, {
              sx: { paddingBottom: 0, paddingTop: 0 },
              colSpan: 10,
              children: Object(I.jsx)(va.a, {
                in: t,
                timeout: 'auto',
                unmountOnExit: !0,
                children: Object(I.jsxs)(m.a, {
                  margin: 1,
                  children: [
                    Object(I.jsx)(O.a, {
                      variant: 'h6',
                      gutterBottom: !0,
                      component: 'div',
                      children: 'Details',
                    }),
                    Object(I.jsxs)(Jr.a, {
                      size: 'small',
                      'aria-label': 'purchases',
                      children: [Object(I.jsx)(Ha, {}), Object(I.jsx)(Ka, {})],
                    }),
                  ],
                }),
              }),
            }),
          })
        }),
        Ha = u.a.memo(function () {
          return Object(I.jsx)(ra.a, {
            children: Object(I.jsxs)(aa.a, {
              children: [
                Object(I.jsx)(ea.a, { children: 'Function' }),
                Object(I.jsx)(ea.a, { children: 'nodeID' }),
                Object(I.jsx)(ea.a, { children: 'Success' }),
                Object(I.jsx)(ea.a, { children: 'NWB' }),
              ],
            }),
          })
        }),
        Ka = u.a.memo(function () {
          var e = u.a.useContext(fu),
            t = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Object.keys(Ca(t)[e].functions)
                }
              })(e),
              La,
            )
          return Object(I.jsx)(Qr.a, {
            children: t.map(function (e) {
              return Object(I.jsx)(Za, { nodeId: e })
            }),
          })
        }),
        Za = u.a.memo(function (e) {
          var t = e.nodeId,
            n = u.a.useContext(fu),
            r = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  return Pa(e, t)(n).name
                }
              })(n, t),
            ),
            a = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  return Pa(e, t)(n).status
                }
              })(n, t),
            ),
            c = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  return Pa(e, t)(n).hasNWB
                }
              })(n, t),
            )
          return Object(I.jsxs)(
            aa.a,
            {
              children: [
                Object(I.jsx)(ea.a, {
                  component: 'th',
                  scope: 'row',
                  children: r,
                }),
                Object(I.jsx)(ea.a, { children: t }),
                Object(I.jsx)(ea.a, {
                  children: Object(I.jsx)(za, { status: a }),
                }),
                Object(I.jsx)(ea.a, {
                  children: Object(I.jsx)(Ba, {
                    name: r,
                    nodeId: t,
                    hasNWB: c,
                  }),
                }),
              ],
            },
            t,
          )
        }),
        Ga = n(847),
        qa = n.n(Ga),
        Ya = u.a.memo(function () {
          var e = Object(z.b)(),
            t = Object(z.c)(Nn),
            n = u.a.useContext(fu),
            r = Object(z.c)(function (e) {
              var t = Nn(e),
                r = Wn(e)
              return n === t && r
            }),
            a = Object(z.c)(_a(n)),
            c = u.a.useState(!1),
            i = Object(N.a)(c, 2),
            o = i[0],
            s = i[1]
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                onClick: function () {
                  s(!0)
                },
                disabled: r,
                color: 'error',
                children: Object(I.jsx)(qa.a, {}),
              }),
              Object(I.jsxs)(ha.a, {
                open: o,
                children: [
                  Object(I.jsxs)(xa.a, {
                    children: ['Are you sure you want to delete ', a, '?'],
                  }),
                  Object(I.jsxs)(ma.a, {
                    children: [
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          s(!1)
                        },
                        variant: 'outlined',
                        color: 'inherit',
                        children: 'Cancel',
                      }),
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          s(!1), e(Ar(n)), n === t && e(Gr())
                        },
                        variant: 'outlined',
                        autoFocus: !0,
                        children: 'OK',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }),
        Xa = n(848),
        $a = n.n(Xa)
      function Ja(e) {
        return Qa.apply(this, arguments)
      }
      function Qa() {
        return (Qa = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/inittimedata/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function ec(e, t) {
        return tc.apply(this, arguments)
      }
      function tc() {
        return (tc = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/timedata/').concat(t), {
                        params: { index: n },
                      })
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function nc(e) {
        return rc.apply(this, arguments)
      }
      function rc() {
        return (rc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/alltimedata/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function ac(e) {
        return cc.apply(this, arguments)
      }
      function cc() {
        return (cc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/data/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function ic(e, t) {
        return oc.apply(this, arguments)
      }
      function oc() {
        return (oc = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/image/').concat(t), {
                        params: {
                          start_index: n.startIndex,
                          end_index: n.endIndex,
                        },
                      })
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function uc(e) {
        return sc.apply(this, arguments)
      }
      function sc() {
        return (sc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/csv/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function lc(e) {
        return dc.apply(this, arguments)
      }
      function dc() {
        return (dc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/image/').concat(t), {})
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function fc(e) {
        return jc.apply(this, arguments)
      }
      function jc() {
        return (jc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/data/').concat(t), {})
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function pc(e) {
        return bc.apply(this, arguments)
      }
      function bc() {
        return (bc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/data/').concat(t), {})
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function hc(e) {
        return mc.apply(this, arguments)
      }
      function mc() {
        return (mc = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/outputs/html/').concat(t), {})
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function xc(e, t) {
        return Oc.apply(this, arguments)
      }
      function Oc() {
        return (Oc = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(
                        ''.concat(_e, '/outputs/image/').concat(t, '/add_roi'),
                        n,
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function vc(e, t) {
        return gc.apply(this, arguments)
      }
      function gc() {
        return (gc = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(
                        ''
                          .concat(_e, '/outputs/image/')
                          .concat(t, '/merge_roi'),
                        n,
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function yc(e, t) {
        return wc.apply(this, arguments)
      }
      function wc() {
        return (wc = Object(F.a)(
          R.a.mark(function e(t, n) {
            var r
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(
                        ''
                          .concat(_e, '/outputs/image/')
                          .concat(t, '/delete_roi'),
                        n,
                      )
                    )
                  case 2:
                    return (r = e.sent), e.abrupt('return', r.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Ic = Object(Re.c)(
          ''.concat(bn, '/getTimeSeriesInitData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), Ja(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        kc = Object(Re.c)(
          ''.concat(bn, '/getTimeSeriesDataById'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = t.path),
                            (a = t.index),
                            (e.prev = 1),
                            (e.next = 4),
                            ec(r, a)
                          )
                        case 4:
                          return (c = e.sent), e.abrupt('return', c)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Cc = Object(Re.c)(
          ''.concat(bn, '/getTimeSeriesAllData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), nc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Sc = Object(Re.c)(
          ''.concat(bn, '/getHeatMapData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), ac(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        _c = Object(Re.c)(
          ''.concat(bn, '/getImageData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c, i
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = t.path),
                            (a = t.startIndex),
                            (c = t.endIndex),
                            (e.prev = 1),
                            (e.next = 4),
                            ic(r, { startIndex: a, endIndex: c })
                          )
                        case 4:
                          return (i = e.sent), e.abrupt('return', i)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Pc = Object(Re.c)(
          ''.concat(bn, '/getCsvData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), uc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Tc = Object(Re.c)(
          ''.concat(bn, '/getRoiData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), lc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Ec = Object(Re.c)(
          ''.concat(bn, '/getScatterData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), fc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Fc = Object(Re.c)(
          ''.concat(bn, '/getBarData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), pc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Nc = Object(Re.c)(
          ''.concat(bn, '/getHTMLData'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), hc(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Dc = function (e) {
          return e.displayData
        },
        Rc = function (e) {
          return function (t) {
            return Dc(t).timeSeries[e].data
          }
        },
        zc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).timeSeries).includes(e)
          }
        },
        Lc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).heatMap).includes(e)
          }
        },
        Mc = function (e) {
          return function (t) {
            return Dc(t).image[e]
          }
        },
        Ac = function (e) {
          return function (t) {
            return Object.keys(Dc(t).image).includes(e)
          }
        },
        Wc = function (e) {
          return function (t) {
            return Ac(e)(t) && Dc(t).image[e].pending
          }
        },
        Bc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).csv).includes(e)
          }
        },
        Vc = function (e) {
          return function (t) {
            return Bc(e)(t) ? Dc(t).csv[e].error : null
          }
        },
        Uc = function (e) {
          return function (t) {
            return Bc(e)(t) && Dc(t).csv[e].pending
          }
        },
        Hc = function (e) {
          return function (t) {
            return Bc(e)(t) && Dc(t).csv[e].fulfilled
          }
        },
        Kc = function (e) {
          return function (t) {
            var n, r
            return null !==
              (n =
                null === (r = Dc(t).roi[e]) || void 0 === r
                  ? void 0
                  : r.data[0]) && void 0 !== n
              ? n
              : []
          }
        },
        Zc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).roi).includes(e)
          }
        },
        Gc = function (e) {
          return function (t) {
            return Zc(e)(t) && Dc(t).roi[e].fulfilled
          }
        },
        qc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).scatter).includes(e)
          }
        },
        Yc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).bar).includes(e)
          }
        },
        Xc = function (e) {
          return function (t) {
            return Object.keys(Dc(t).html).includes(e)
          }
        },
        $c = 'visualaizeItem',
        Jc = 'displayData'
      function Qc(e) {
        return e.itemType === Jc
      }
      function ei(e) {
        return e.itemType === Jc && e.dataType === xn
      }
      function ti(e) {
        return e.itemType === Jc && e.dataType === hn
      }
      function ni(e) {
        return e.itemType === Jc && e.dataType === On
      }
      function ri(e) {
        return e.itemType === Jc && e.dataType === mn
      }
      function ai(e) {
        return e.itemType === Jc && e.dataType === gn
      }
      function ci(e) {
        return e.itemType === Jc && e.dataType === yn
      }
      var ii = function (e) {
          return e.visualaizeItem.selectedItemId
        },
        oi = function (e) {
          return Object.keys(e.visualaizeItem.items)
            .map(Number)
            .filter(function (t) {
              var n = si(t)(e)
              return ei(n) && !n.isWorkflowDialog
            })
        },
        ui = function (e) {
          return e.visualaizeItem.items
        },
        si = function (e) {
          return function (t) {
            return t.visualaizeItem.items[e]
          }
        },
        li = function (e) {
          return e.visualaizeItem.layout
        },
        di = function (e) {
          return function (t) {
            return si(e)(t).width
          }
        },
        fi = function (e) {
          return function (t) {
            return si(e)(t).height
          }
        },
        ji = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (Qc(n)) return n.dataType
            throw new Error('invalid VisualaizeItemType')
          }
        },
        pi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (Qc(n)) return n.nodeId
            throw new Error('invalid VisualaizeItemType')
          }
        },
        bi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (Qc(n)) return n.filePath
            throw new Error('invalid VisualaizeItemType')
          }
        },
        hi = function (e) {
          return function (t) {
            return si(e)(t).saveFileName
          }
        },
        mi = function (e) {
          return function (t) {
            return si(e)(t).saveFormat
          }
        },
        xi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (Qc(n)) return n.filePath
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Oi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (Qc(n)) return n.filePath
            throw new Error('invalid VisualaizeItemType')
          }
        },
        vi = function (e) {
          return function (t) {
            var n,
              r,
              a = si(e)(t)
            if (ei(a))
              return null !==
                (n =
                  null === (r = a.roiItem) || void 0 === r
                    ? void 0
                    : r.filePath) && void 0 !== n
                ? n
                : null
            throw new Error('invalid VisualaizeItemType')
          }
        },
        gi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.showticklabels
            throw new Error('invalid VisualaizeItemType')
          }
        },
        yi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.zsmooth
            throw new Error('invalid VisualaizeItemType')
          }
        },
        wi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.startIndex
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ii = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.endIndex
            throw new Error('invalid VisualaizeItemType')
          }
        },
        ki = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.showline
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ci = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.showgrid
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Si = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.showscale
            throw new Error('invalid VisualaizeItemType')
          }
        },
        _i = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.colors
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Pi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.alpha
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ti = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ei(n)) return n.roiAlpha
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ei = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.offset
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Fi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.span
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ni = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.showgrid
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Di = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.showline
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ri = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.showticklabels
            throw new Error('invalid VisualaizeItemType')
          }
        },
        zi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.zeroline
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Li = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.xrange
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Mi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ti(n)) return n.drawOrderList
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ai = function (e) {
          return function (t) {
            var n,
              r = si(e)(t)
            if (ti(r)) {
              if (null != r.refImageItemId) {
                var a,
                  c = ui(t)[r.refImageItemId]
                if (
                  ei(c) &&
                  null !=
                    (null === (a = c.roiItem) || void 0 === a
                      ? void 0
                      : a.filePath)
                )
                  return ((n = c.roiItem.filePath),
                  function (e) {
                    return Gc(n)(e) ? Dc(e).roi[n].roiUniqueList : null
                  })(t)
              }
              return null
            }
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Wi = function (e) {
          return function (t) {
            if (ti(si(e)(t))) {
              var n = Oi(e)(t)
              if (null != n && zc(n)(t)) {
                var r = Object.keys(Rc(n)(t)),
                  a = Ai(e)(t)
                return null != a
                  ? r.filter(function (e) {
                      return a.includes(e)
                    })
                  : r
              }
              return []
            }
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Bi = function (e) {
          return function (t) {
            var n = Kc(e)(t)
            return 0 !== n.length
              ? Math.max.apply(
                  Math,
                  Object(Yr.a)(
                    n.map(function (e) {
                      return Math.max.apply(Math, Object(Yr.a)(e))
                    }),
                  ),
                )
              : 0
          }
        },
        Vi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ri(n)) return n.showscale
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ui = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ri(n)) return n.colors
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Hi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ni(n)) return n.transpose
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Ki = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ni(n)) return n.setHeader
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Zi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ni(n)) return n.setIndex
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Gi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ci(n)) return n.index
            throw new Error('invalid VisualaizeItemType')
          }
        },
        qi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ai(n)) return n.xIndex
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Yi = function (e) {
          return function (t) {
            var n = si(e)(t)
            if (ai(n)) return n.yIndex
            throw new Error('invalid VisualaizeItemType')
          }
        },
        Xi = function (e) {
          return function (t) {
            var n = ui(t),
              r = n[e].filePath
            return (
              1 ===
              Object.values(n).filter(function (e) {
                return e.filePath === r
              }).length
            )
          }
        },
        $i = Object(Re.c)(
          ''.concat($c, '/setImageItemClikedDataId'),
          function (e, t) {
            var n = e.itemId,
              r = e.clickedDataId,
              a = ui(t.getState())
            Object.values(a).forEach(function (e) {
              ti(e) &&
                null != e.filePath &&
                e.refImageItemId === n &&
                !e.drawOrderList.includes(r) &&
                t.dispatch(kc({ path: e.filePath, index: r }))
            })
          },
        ),
        Ji = Object(Re.c)(
          ''.concat($c, '/selectingImageArea'),
          function (e, t) {
            var n = e.itemId,
              r = e.range,
              a = r.x,
              c = r.y,
              i = a.map(Math.round),
              o = Object(N.a)(i, 2),
              u = o[0],
              s = o[1],
              l = c.map(Math.round),
              d = Object(N.a)(l, 2),
              f = d[0],
              j = d[1],
              p = [],
              b = ui(t.getState()),
              h = b[n]
            if (ei(h) && null != h.roiItem) {
              var m = h.roiItem.filePath
              if (null != m) {
                for (var x = Kc(m)(t.getState()), O = u; O <= s; O++)
                  for (var v = f; v <= j; v++) {
                    var g = x[v][O]
                    if (null != g) {
                      var y = String(g)
                      p.includes(y) || p.push(y)
                    }
                  }
                Object.values(b).forEach(function (e) {
                  if (ti(e) && null != e.filePath && e.refImageItemId === n) {
                    var r = e.filePath
                    p.forEach(function (e) {
                      t.dispatch(kc({ path: r, index: String(e) }))
                    })
                  }
                })
              }
            }
            return p
          },
        ),
        Qi = Object(Re.b)(''.concat($c, '/deleteDisplayItem')),
        eo = Object(Re.b)(''.concat($c, '/setNewDisplayDataPath')),
        to = { items: {}, selectedItemId: null, layout: [] },
        no = {
          itemType: Jc,
          filePath: null,
          nodeId: null,
          width: 500,
          height: 500,
          isWorkflowDialog: !1,
          saveFileName: 'newPlot',
          saveFormat: 'png',
        },
        ro = Object(K.a)(
          Object(K.a)({}, no),
          {},
          {
            dataType: xn,
            startIndex: 1,
            endIndex: 10,
            showticklabels: !1,
            showline: !0,
            zsmooth: 'best',
            showgrid: !1,
            showscale: !1,
            colors: [
              { rgb: 'rgb(0, 0, 0)', offset: '0' },
              { rgb: 'rgb(255, 255, 255)', offset: '1.0' },
            ],
            activeIndex: 0,
            alpha: 1,
            roiItem: null,
            roiAlpha: 1,
            duration: 500,
          },
        ),
        ao = Object(K.a)(
          Object(K.a)({}, no),
          {},
          {
            dataType: hn,
            offset: !0,
            span: 5,
            showgrid: !0,
            showline: !0,
            showticklabels: !0,
            zeroline: !1,
            xrange: { left: void 0, right: void 0 },
            maxIndex: 0,
            drawOrderList: [],
            refImageItemId: null,
          },
        ),
        co = Object(K.a)(
          Object(K.a)({}, no),
          {},
          {
            dataType: mn,
            showscale: !0,
            colors: [
              { rgb: 'rgb(0, 0, 255)', offset: '0' },
              { rgb: 'rgb(200, 200, 200)', offset: '0.5' },
              { rgb: 'rgb(255, 0, 0)', offset: '1.0' },
            ],
          },
        ),
        io = Object(K.a)(
          Object(K.a)({}, no),
          {},
          { dataType: On, setHeader: null, setIndex: !1, transpose: !1 },
        ),
        oo = Object(K.a)(Object(K.a)({}, no), {}, { dataType: vn }),
        uo = Object(K.a)(
          Object(K.a)({}, no),
          {},
          { dataType: gn, xIndex: '0', yIndex: '1' },
        ),
        so = Object(K.a)(Object(K.a)({}, no), {}, { dataType: yn, index: '0' }),
        lo = Object(K.a)(Object(K.a)({}, no), {}, { dataType: wn }),
        fo = Object(K.a)(Object(K.a)({}, no), {}, { dataType: In }),
        jo = Object(K.a)(Object(K.a)({}, no), {}, { dataType: kn }),
        po = Object(K.a)(Object(K.a)({}, no), {}, { dataType: Cn })
      function bo(e) {
        switch (e) {
          case xn:
            return ro
          case mn:
            return co
          case hn:
            return ao
          case On:
            return io
          case vn:
            return oo
          case gn:
            return uo
          case yn:
            return so
          case wn:
            return lo
          case In:
            return fo
          case kn:
            return jo
          case Cn:
            return po
        }
      }
      var ho = Object(Re.d)({
        name: $c,
        initialState: to,
        reducers: {
          pushInitialItemToNewRow: function (e) {
            var t = xo(e)
            e.layout.push([t])
          },
          insertInitialItemToNextColumn: function (e, t) {
            var n = xo(e),
              r = t.payload,
              a = e.layout.findIndex(function (e) {
                return e.includes(r)
              }),
              c = e.layout[a].indexOf(r)
            e.layout[a].splice(c + 1, 0, n)
          },
          addItemForWorkflowDialog: function (e, t) {
            var n = t.payload,
              r = n.nodeId,
              a = n.filePath,
              c = n.dataType,
              i = mo(e),
              o = null != i ? i + 1 : 0
            e.items[o] = Object(K.a)(
              Object(K.a)({}, bo(c)),
              {},
              { isWorkflowDialog: !0, nodeId: r, filePath: a },
            )
          },
          deleteAllItemForWorkflowDialog: function (e) {
            Object.entries(e.items)
              .filter(function (e) {
                var t = Object(N.a)(e, 2)
                t[0]
                return t[1].isWorkflowDialog
              })
              .map(function (e) {
                var t = Object(N.a)(e, 2),
                  n = t[0]
                t[1]
                return Number(n)
              })
              .forEach(function (t) {
                return delete e.items[t]
              })
          },
          setItemSize: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.width,
              c = n.height,
              i = e.items[r]
            ;(i.width = a), (i.height = c)
          },
          selectItem: function (e, t) {
            e.selectedItemId = t.payload
          },
          reset: function (e) {
            ;(e.items = to.items),
              (e.layout = to.layout),
              (e.selectedItemId = to.selectedItemId)
          },
          setRoiItemFilePath: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.filePath,
              c = n.nodeId,
              i = n.outputKey,
              o = e.items[r]
            ei(o) &&
              (Object.values(e.items).forEach(function (e) {
                ti(e) &&
                  null != e.filePath &&
                  e.refImageItemId === r &&
                  (e.drawOrderList = [])
              }),
              null != o.roiItem
                ? ((o.roiItem.filePath = a),
                  (o.roiItem.nodeId = c),
                  (o.roiItem.outputKey = i))
                : (o.roiItem = Object(K.a)(
                    Object(K.a)({}, oo),
                    {},
                    { filePath: a, nodeId: c, outputKey: i },
                  )))
          },
          setFilePath: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.filePath,
              c = n.nodeId,
              i = e.items[r]
            if (!Qc(i)) throw new Error('error')
            ;(i.filePath = a), (i.nodeId = c)
          },
          setSaveFormat: function (e, t) {
            e.items[t.payload.itemId].saveFormat = t.payload.saveFormat
          },
          setSaveFileName: function (e, t) {
            e.items[t.payload.itemId].saveFileName = t.payload.saveFileName
          },
          setImageItemFilePath: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.filePath,
              c = n.nodeId,
              i = e.items[r]
            ei(i) && ((i.filePath = a), (i.nodeId = c))
          },
          setTimeSeriesItemFilePath: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.filePath,
              c = n.nodeId,
              i = e.items[r]
            ti(i) && ((i.filePath = a), (i.nodeId = c))
          },
          setHeatMapItemFilePath: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.filePath,
              c = n.nodeId,
              i = e.items[r]
            ri(i) && ((i.filePath = a), (i.nodeId = c))
          },
          resetImageActiveIndex: function (e, t) {
            Oo(e, t.payload)
          },
          incrementImageActiveIndex: function (e, t) {
            var n = t.payload.itemId,
              r = e.items[n]
            ei(r) && r.activeIndex++
          },
          decrementImageActiveIndex: function (e, t) {
            var n = t.payload.itemId,
              r = e.items[n]
            ei(r) && r.activeIndex--
          },
          setImageActiveIndex: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.activeIndex,
              c = e.items[r]
            ei(c) && (c.activeIndex = a)
          },
          setImageItemShowticklabels: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.showticklabels = t.payload.showticklabels)
          },
          setImageItemZsmooth: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.zsmooth = t.payload.zsmooth)
          },
          setImageItemShowLine: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.showline = t.payload.showline)
          },
          setImageItemShowGrid: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.showgrid = t.payload.showgrid)
          },
          setImageItemShowScale: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.showscale = t.payload.showscale)
          },
          setImageItemColors: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.colors = t.payload.colors)
          },
          setImageItemStartIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.startIndex = t.payload.startIndex)
          },
          setImageItemEndIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.endIndex = t.payload.endIndex)
          },
          setImageItemAlpha: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.alpha = t.payload.alpha)
          },
          setImageItemRoiAlpha: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.roiAlpha = t.payload.roiAlpha)
          },
          setImageItemDuration: function (e, t) {
            var n = e.items[t.payload.itemId]
            ei(n) && (n.duration = t.payload.duration)
          },
          setTimeSeriesItemOffset: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.offset = t.payload.offset)
          },
          setTimeSeriesItemSpan: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.span = t.payload.span)
          },
          setTimeSeriesItemShowGrid: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.showgrid = t.payload.showgrid)
          },
          setTimeSeriesItemShowLine: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.showline = t.payload.showline)
          },
          setTimeSeriesItemShowTickLabels: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.showticklabels = t.payload.showticklabels)
          },
          setTimeSeriesItemZeroLine: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.zeroline = t.payload.zeroline)
          },
          setTimeSeriesItemXrangeLeft: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.xrange.left = t.payload.left)
          },
          setTimeSeriesItemXrangeRight: function (e, t) {
            var n = e.items[t.payload.itemId]
            ti(n) && (n.xrange.right = t.payload.right)
          },
          setTimeSeriesItemDrawOrderList: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.drawOrderList,
              c = e.items[r]
            ti(c) && (c.drawOrderList = a)
          },
          resetAllOrderList: function (e) {
            Object.keys(e.items).forEach(function (t) {
              var n = e.items[t]
              ti(n) && (n.drawOrderList = [])
            })
          },
          setTimeSeriesItemMaxIndex: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.maxIndex,
              c = e.items[r]
            ti(c) && (c.maxIndex = a)
          },
          setTimeSeriesRefImageItemId: function (e, t) {
            var n = t.payload,
              r = n.itemId,
              a = n.refImageItemId,
              c = e.items[r]
            ti(c) &&
              ((c.refImageItemId = null !== a && void 0 !== a ? a : null),
              (c.drawOrderList = []))
          },
          setHeatMapItemShowScale: function (e, t) {
            var n = e.items[t.payload.itemId]
            ri(n) && (n.showscale = t.payload.showscale)
          },
          setHeatMapItemColors: function (e, t) {
            var n = e.items[t.payload.itemId]
            ri(n) && (n.colors = t.payload.colors)
          },
          setCsvItemTranspose: function (e, t) {
            var n = e.items[t.payload.itemId]
            ni(n) && (n.transpose = t.payload.transpose)
          },
          setCsvItemSetHeader: function (e, t) {
            var n = e.items[t.payload.itemId]
            ni(n) && (n.setHeader = t.payload.setHeader)
          },
          setCsvItemSetIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ni(n) && (n.setIndex = t.payload.setIndex)
          },
          setScatterItemXIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ai(n) && (n.xIndex = t.payload.xIndex)
          },
          setScatterItemYIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ai(n) && (n.yIndex = t.payload.yIndex)
          },
          setBarItemIndex: function (e, t) {
            var n = e.items[t.payload.itemId]
            ci(n) && (n.index = t.payload.index)
          },
        },
        extraReducers: function (e) {
          e.addCase(Qi, function (e, t) {
            var n = t.payload.itemId
            ei(e.items[n]) &&
              Object.values(e.items).forEach(function (e) {
                ti(e) && e.refImageItemId === n && (e.refImageItemId = null)
              }),
              delete e.items[n],
              n === e.selectedItemId && (e.selectedItemId = null),
              e.layout.forEach(function (t, r) {
                var a = t.indexOf(n)
                ;-1 !== a && t.splice(a, 1),
                  0 === t.length && e.layout.splice(r, 1)
              })
          })
            .addCase(eo, function (e, t) {
              var n = t.payload,
                r = n.itemId,
                a = n.filePath,
                c = n.nodeId,
                i = n.dataType,
                o = e.items[r]
              if (!Qc(o)) throw new Error('invalid VisualaizeItemType')
              null != i
                ? (e.items[r] = Object(K.a)(
                    Object(K.a)({}, bo(i)),
                    {},
                    {
                      width: o.width,
                      height: o.height,
                      filePath: a,
                      nodeId: c,
                    },
                  ))
                : ((o.filePath = a), (o.nodeId = c)),
                Oo(e, { itemId: r })
            })
            .addCase($i.fulfilled, function (e, t) {
              var n = t.meta.arg,
                r = n.itemId,
                a = n.clickedDataId,
                c = e.items[r]
              ei(c) && (c.clickedDataId = a),
                Object.values(e.items).forEach(function (e) {
                  ti(e) &&
                    (null == e.refImageItemId ||
                      r !== e.refImageItemId ||
                      e.drawOrderList.includes(a) ||
                      e.drawOrderList.push(a))
                })
            })
            .addCase(Ji.fulfilled, function (e, t) {
              var n = t.meta.arg.itemId,
                r = t.payload
              Object.values(e.items).forEach(function (e) {
                ti(e) &&
                  null != e.refImageItemId &&
                  n === e.refImageItemId &&
                  (e.drawOrderList = r)
              })
            })
        },
      })
      function mo(e) {
        var t = Object.keys(e.items).map(function (e) {
          return Number(e)
        })
        return t.length > 0
          ? t.reduce(function (e, t) {
              return Math.max(e, t)
            })
          : null
      }
      function xo(e) {
        var t = mo(e),
          n = null != t ? t + 1 : 0
        return (e.items[n] = bo(xn)), (e.selectedItemId = n), n
      }
      function Oo(e, t) {
        var n = t.itemId,
          r = e.items[n]
        ei(r) && (r.activeIndex = 0)
      }
      var vo = ho.actions,
        go = vo.pushInitialItemToNewRow,
        yo = vo.insertInitialItemToNextColumn,
        wo = vo.addItemForWorkflowDialog,
        Io = vo.deleteAllItemForWorkflowDialog,
        ko = vo.setItemSize,
        Co = vo.selectItem,
        So = (vo.setFilePath, vo.setSaveFormat),
        _o = vo.setSaveFileName,
        Po =
          (vo.setHeatMapItemFilePath,
          vo.setImageItemFilePath,
          vo.setTimeSeriesItemFilePath,
          vo.setRoiItemFilePath),
        To = vo.resetImageActiveIndex,
        Eo = vo.incrementImageActiveIndex,
        Fo = (vo.decrementImageActiveIndex, vo.setImageActiveIndex),
        No = vo.setImageItemShowticklabels,
        Do = vo.setImageItemZsmooth,
        Ro = vo.setImageItemShowLine,
        zo = vo.setImageItemShowGrid,
        Lo = vo.setImageItemShowScale,
        Mo = vo.setImageItemColors,
        Ao = vo.setImageItemStartIndex,
        Wo = vo.setImageItemEndIndex,
        Bo = vo.setImageItemAlpha,
        Vo = vo.setImageItemRoiAlpha,
        Uo = vo.setImageItemDuration,
        Ho = vo.setTimeSeriesItemOffset,
        Ko = vo.setTimeSeriesItemSpan,
        Zo = vo.setTimeSeriesItemShowGrid,
        Go = vo.setTimeSeriesItemShowLine,
        qo = vo.setTimeSeriesItemShowTickLabels,
        Yo = vo.setTimeSeriesItemZeroLine,
        Xo = vo.setTimeSeriesItemXrangeLeft,
        $o = vo.setTimeSeriesItemXrangeRight,
        Jo = vo.setTimeSeriesItemDrawOrderList,
        Qo = (vo.setTimeSeriesItemMaxIndex, vo.setTimeSeriesRefImageItemId),
        eu = vo.setHeatMapItemShowScale,
        tu = vo.setHeatMapItemColors,
        nu = vo.setCsvItemTranspose,
        ru = vo.setCsvItemSetHeader,
        au = vo.setCsvItemSetIndex,
        cu = vo.setScatterItemXIndex,
        iu = vo.setScatterItemYIndex,
        ou = vo.setBarItemIndex,
        uu = vo.resetAllOrderList,
        su = vo.reset,
        lu = ho.reducer,
        du = u.a.memo(function () {
          var e = Object(z.b)(),
            t = Object(z.c)(It),
            n = u.a.useContext(fu),
            r = Object(p.b)().enqueueSnackbar
          return Object(I.jsx)(d.a, {
            onClick: function () {
              if (!t) throw new Error('Workspace ID is missing.')
              e(Br({ workspaceId: t, uid: n }))
                .unwrap()
                .then(function () {
                  r('Successfully imported.', { variant: 'success' }), e(su())
                })
            },
            children: Object(I.jsx)($a.a, {}),
          })
        })
      var fu = u.a.createContext(''),
        ju = function () {
          var e = Object(z.c)(ya),
            t = Object(z.c)(wa),
            n = Object(z.c)(Ia),
            r = Object(z.b)()
          return (
            u.a.useEffect(
              function () {
                e && r(Mr())
              },
              [r, e],
            ),
            t ? Object(I.jsx)(bu, {}) : n ? Object(I.jsx)(pu, {}) : null
          )
        },
        pu = function () {
          var e = Object(z.c)(ka)
          return Object(I.jsxs)(Xr.a, {
            severity: 'error',
            children: [
              Object(I.jsx)($r.a, { children: 'failed to get experiments...' }),
              e,
            ],
          })
        },
        bu = u.a.memo(function () {
          var e = Object(z.c)(Nn),
            t = Object(z.c)(Ca),
            n = Object.values(t),
            r = Object.keys(t),
            a = Object(z.b)(),
            c = u.a.useState('asc'),
            i = Object(N.a)(c, 2),
            s = i[0],
            l = i[1],
            d = u.a.useState('timestamp'),
            f = Object(N.a)(d, 2),
            j = f[0],
            p = f[1],
            b = Object(o.useState)([]),
            h = Object(N.a)(b, 2),
            x = h[0],
            v = h[1],
            g = u.a.useState(!1),
            y = Object(N.a)(g, 2),
            w = y[0],
            k = y[1],
            C = function (e) {
              x.includes(e)
                ? v(
                    x.filter(function (t) {
                      return t !== e
                    }),
                  )
                : v([].concat(Object(Yr.a)(x), [e]))
            },
            S = 0 === r.length,
            _ = u.a.useState(0),
            P = Object(N.a)(_, 2),
            T = P[0],
            E = P[1],
            F = (function (e, t, n) {
              var r = u.a.useState(function () {
                  var r = localStorage.getItem(e)
                  return null != r ? n(JSON.parse(r)) : t
                }),
                a = Object(N.a)(r, 2),
                c = a[0],
                i = a[1]
              return (
                u.a.useEffect(
                  function () {
                    localStorage.setItem(e, JSON.stringify(c))
                  },
                  [c, e],
                ),
                [c, i]
              )
            })('optinist_experiment_table_per_page', 10, function (e) {
              var t = Number(e)
              return isNaN(t) ? 10 : t
            }),
            D = Object(N.a)(F, 2),
            R = D[0],
            L = D[1],
            M = T > 0 ? Math.max(0, (1 + T) * R - r.length) : 0
          return Object(I.jsxs)(m.a, {
            sx: { display: 'flex', flexDirection: 'column' },
            children: [
              Object(I.jsxs)(m.a, {
                sx: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                },
                children: [
                  !S &&
                    Object(I.jsxs)(O.a, {
                      sx: { flexGrow: 1, m: 1 },
                      children: [x.length, ' selected'],
                    }),
                  Object(I.jsx)(G.a, {
                    sx: {
                      margin: function (e) {
                        return e.spacing(0, 1, 1, 0)
                      },
                    },
                    variant: 'outlined',
                    endIcon: Object(I.jsx)(fa.a, {}),
                    onClick: function () {
                      a(Mr())
                    },
                    children: 'Reload',
                  }),
                  Object(I.jsx)(G.a, {
                    sx: {
                      marginBottom: function (e) {
                        return e.spacing(1)
                      },
                    },
                    variant: 'outlined',
                    color: 'error',
                    endIcon: Object(I.jsx)(pa.a, {}),
                    onClick: function () {
                      k(!0)
                    },
                    disabled: 0 === x.length,
                    children: 'Delete',
                  }),
                ],
              }),
              Object(I.jsxs)(ha.a, {
                open: w,
                children: [
                  Object(I.jsx)(xa.a, {
                    children: 'Are you sure you want to delete?',
                  }),
                  Object(I.jsxs)(ma.a, {
                    children: [
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          k(!1)
                        },
                        variant: 'outlined',
                        color: 'inherit',
                        children: 'Cancel',
                      }),
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          a(Wr(x)),
                            x.filter(function (t) {
                              return t === e
                            }).length > 0 && a(Gr()),
                            v([]),
                            k(!1)
                        },
                        variant: 'outlined',
                        autoFocus: !0,
                        children: 'OK',
                      }),
                    ],
                  }),
                ],
              }),
              Object(I.jsxs)(ia.a, {
                elevation: 0,
                variant: 'outlined',
                sx: { flexGlow: 1, height: '100%' },
                children: [
                  Object(I.jsx)(na.a, {
                    component: ia.a,
                    elevation: 0,
                    children: Object(I.jsxs)(Jr.a, {
                      'aria-label': 'collapsible table',
                      children: [
                        Object(I.jsx)(hu, {
                          order: s,
                          sortHandler: function (e) {
                            return function (t) {
                              l(j === e && 'asc' === s ? 'desc' : 'asc'), p(e)
                            }
                          },
                          allCheckIndeterminate:
                            0 !== x.length &&
                            x.length !== Object.keys(t).length,
                          allChecked: x.length === Object.keys(t).length,
                          onChangeAllCheck: function (e) {
                            v(
                              e
                                ? n.map(function (e) {
                                    return e.uid
                                  })
                                : [],
                            )
                          },
                          checkboxVisible: !S,
                        }),
                        Object(I.jsxs)(Qr.a, {
                          children: [
                            n
                              .sort(vu(s, j))
                              .slice(T * R, T * R + R)
                              .map(function (e) {
                                return Object(I.jsx)(
                                  fu.Provider,
                                  {
                                    value: e.uid,
                                    children: Object(I.jsx)(mu, {
                                      onCheckBoxClick: C,
                                      checked: x.includes(e.uid),
                                    }),
                                  },
                                  e.uid,
                                )
                              }),
                            M > 0 &&
                              Object(I.jsx)(aa.a, {
                                style: { height: 53 * M },
                                children: Object(I.jsx)(ea.a, { colSpan: 10 }),
                              }),
                            S &&
                              Object(I.jsx)(aa.a, {
                                children: Object(I.jsx)(ea.a, {
                                  colSpan: 10,
                                  children: Object(I.jsx)(O.a, {
                                    sx: {
                                      color: function (e) {
                                        return e.palette.text.secondary
                                      },
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      height: '300px',
                                      textAlign: 'center',
                                    },
                                    variant: 'h6',
                                    children: 'No Rows...',
                                  }),
                                }),
                              }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  Object(I.jsx)(ca.a, {
                    rowsPerPageOptions: [5, 10, 25],
                    component: 'div',
                    count: r.length,
                    rowsPerPage: R,
                    page: T,
                    onPageChange: function (e, t) {
                      E(t)
                    },
                    onRowsPerPageChange: function (e) {
                      var t = parseInt(e.target.value, 10)
                      L(t), E(0)
                    },
                  }),
                ],
              }),
            ],
          })
        }),
        hu = u.a.memo(function (e) {
          var t = e.order,
            n = e.sortHandler,
            r = e.allChecked,
            a = e.onChangeAllCheck,
            c = e.allCheckIndeterminate,
            i = e.checkboxVisible
          return Object(I.jsx)(ra.a, {
            children: Object(I.jsxs)(aa.a, {
              children: [
                Object(I.jsx)(ea.a, {
                  padding: 'checkbox',
                  children: Object(I.jsx)(ba.a, {
                    sx: { visibility: i ? 'visible' : 'hidden' },
                    checked: r,
                    indeterminate: c,
                    onChange: function (e) {
                      return a(e.target.checked)
                    },
                  }),
                }),
                Object(I.jsx)(ea.a, {}),
                Object(I.jsx)(ea.a, {
                  children: Object(I.jsx)(Oa.a, {
                    active: !0,
                    direction: t,
                    onClick: n('timestamp'),
                    children: 'Timestamp',
                  }),
                }),
                Object(I.jsx)(ea.a, {
                  children: Object(I.jsx)(Oa.a, {
                    active: !0,
                    direction: t,
                    onClick: n('uid'),
                    children: 'ID',
                  }),
                }),
                Object(I.jsx)(ea.a, {
                  children: Object(I.jsx)(Oa.a, {
                    active: !0,
                    direction: t,
                    onClick: n('name'),
                    children: 'Name',
                  }),
                }),
                Object(I.jsx)(ea.a, { children: 'Success' }),
                Object(I.jsx)(ea.a, { children: 'Reproduce' }),
                Object(I.jsx)(ea.a, { children: 'SnakeFile' }),
                Object(I.jsx)(ea.a, { children: 'NWB' }),
                Object(I.jsx)(ea.a, { children: 'Delete' }),
              ],
            }),
          })
        }),
        mu = u.a.memo(function (e) {
          var t = e.onCheckBoxClick,
            n = e.checked,
            r = Object(z.c)(It),
            a = u.a.useContext(fu),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Sa(e)(t).timestamp
                }
              })(a),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = Ca(t)[e]
                  if (n.status) return n.status
                  var r = Ca(t)[e].functions,
                    a = Object.values(r).map(function (e) {
                      return e.status
                    })
                  return a.findIndex(function (e) {
                    return 'error' === e
                  }) >= 0
                    ? 'error'
                    : a.findIndex(function (e) {
                        return 'running' === e
                      }) >= 0
                    ? 'running'
                    : 'success'
                }
              })(a),
            ),
            s = Object(z.c)(_a(a)),
            l = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Sa(e)(t).hasNWB
                }
              })(a),
            ),
            f = u.a.useState(!1),
            j = Object(N.a)(f, 2),
            p = j[0],
            b = j[1],
            h = Object(o.useState)(!1),
            m = Object(N.a)(h, 2),
            x = m[0],
            O = m[1],
            v = Object(o.useState)(''),
            g = Object(N.a)(v, 2),
            y = g[0],
            w = g[1],
            k = Object(o.useState)(s),
            C = Object(N.a)(k, 2),
            S = C[0],
            _ = C[1],
            P = Object(z.b)(),
            T = (function () {
              var e = Object(F.a)(
                R.a.mark(function e() {
                  return R.a.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (S !== s && void 0 !== r) {
                            e.next = 2
                            break
                          }
                          return e.abrupt('return')
                        case 2:
                          return (e.next = 4), Rr(r, a, S)
                        case 4:
                          P(Mr())
                        case 5:
                        case 'end':
                          return e.stop()
                      }
                  }, e)
                }),
              )
              return function () {
                return e.apply(this, arguments)
              }
            })()
          return Object(I.jsxs)(u.a.Fragment, {
            children: [
              Object(I.jsxs)(aa.a, {
                sx: Object(H.a)(
                  { '& > *': { borderBottom: 'unset' } },
                  '& .'.concat(ta.a.root),
                  { borderBottomWidth: 0 },
                ),
                children: [
                  Object(I.jsx)(ea.a, {
                    padding: 'checkbox',
                    children: Object(I.jsx)(ba.a, {
                      onChange: function () {
                        return t(a)
                      },
                      checked: n,
                    }),
                  }),
                  Object(I.jsx)(ea.a, {
                    children: Object(I.jsx)(d.a, {
                      'aria-label': 'expand row',
                      size: 'small',
                      onClick: function () {
                        return b(function (e) {
                          return !e
                        })
                      },
                      children: p
                        ? Object(I.jsx)(la.a, {})
                        : Object(I.jsx)(ua.a, {}),
                    }),
                  }),
                  Object(I.jsx)(ea.a, {
                    component: 'th',
                    scope: 'row',
                    children: c,
                  }),
                  Object(I.jsx)(ea.a, { children: a }),
                  Object(I.jsx)(ea.a, {
                    sx: { width: 160, position: 'relative' },
                    onClick: function (e) {
                      x || y || (e.preventDefault(), O(!0))
                    },
                    children: x
                      ? Object(I.jsxs)(I.Fragment, {
                          children: [
                            Object(I.jsx)(xu, {
                              placeholder: 'Name',
                              error: !!y,
                              onChange: function (e) {
                                var t = ''
                                e.target.value.trim() || (t = 'Name is empty'),
                                  w(t),
                                  _(e.target.value)
                              },
                              autoFocus: !0,
                              onBlur: function (e) {
                                e.preventDefault(),
                                  y ||
                                    setTimeout(function () {
                                      O(!1), T()
                                    }, 300)
                              },
                              value: S,
                            }),
                            y ? Object(I.jsx)(Ou, { children: y }) : null,
                          ],
                        })
                      : S,
                  }),
                  Object(I.jsx)(ea.a, {
                    children: Object(I.jsx)(za, { status: i }),
                  }),
                  Object(I.jsx)(ea.a, { children: Object(I.jsx)(du, {}) }),
                  Object(I.jsx)(ea.a, { children: Object(I.jsx)(Va, {}) }),
                  Object(I.jsx)(ea.a, {
                    children: Object(I.jsx)(Ba, { name: a, hasNWB: l }),
                  }),
                  Object(I.jsx)(ea.a, { children: Object(I.jsx)(Ya, {}) }),
                ],
              }),
              Object(I.jsx)(Ua, { open: p }),
            ],
          })
        }),
        xu = Object(x.a)('input')(function (e) {
          var t = e.error
          return {
            width: '100%',
            border: 'none',
            borderBottom: '1px solid',
            outline: 'none',
            color: t ? '#d32f2f' : '',
            borderColor: t ? '#d32f2f' : '',
          }
        }),
        Ou = Object(x.a)(O.a)(function () {
          return {
            color: '#d32f2f',
            fontSize: 12,
            height: 12,
            position: 'absolute',
            bottom: 12,
          }
        })
      function vu(e, t) {
        return 'desc' === e
          ? function (e, n) {
              return gu(e, n, t)
            }
          : function (e, n) {
              return -gu(e, n, t)
            }
      }
      function gu(e, t, n) {
        return t[n] < e[n] ? -1 : t[n] > e[n] ? 1 : 0
      }
      var yu = u.a.memo(function () {
          return Object(I.jsx)('div', {
            style: { display: 'flex' },
            children: Object(I.jsx)('main', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100vh',
                padding: 16,
              },
              children: Object(I.jsx)(ju, {}),
            }),
          })
        }),
        wu = n(1762),
        Iu = n(875),
        ku = n(1802),
        Cu = n(1777),
        Su = n(161),
        _u = n(256),
        Pu = n.n(_u),
        Tu = n(400),
        Eu = n.n(Tu),
        Fu = n(257),
        Nu = n.n(Fu),
        Du = n(1767)
      function Ru(e) {
        return 'child' === e.type
      }
      function zu(e, t) {
        for (var n = null, r = 0, a = Object.entries(e); r < a.length; r++) {
          var c = Object(N.a)(a[r], 2),
            i = c[0],
            o = c[1]
          if ((Ru(o) ? i === t && (n = o) : (n = zu(o.children, t)), null != n))
            break
        }
        return n
      }
      function Lu(e) {
        var t = {}
        return (
          Object.entries(e).forEach(function (e) {
            var n = Object(N.a)(e, 2),
              r = n[0],
              a = n[1]
            if (Object.prototype.hasOwnProperty.call(a, 'children'))
              t[r] = { type: 'parent', children: Lu(a.children) }
            else {
              var c = a
              t[r] = {
                type: 'child',
                functionPath: c.path,
                args: c.args,
                returns: c.returns,
              }
            }
          }),
          t
        )
      }
      var Mu = function (e) {
          return e.algorithmList
        },
        Au = function (e) {
          return Mu(e).isLatest
        },
        Wu = function (e) {
          return Mu(e).tree
        },
        Bu = 'algorithmList'
      function Vu() {
        return Uu.apply(this, arguments)
      }
      function Uu() {
        return (Uu = Object(F.a)(
          R.a.mark(function e() {
            var t
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), Te.get(''.concat(_e, '/algolist'))
                  case 2:
                    return (t = e.sent), e.abrupt('return', t.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Hu = Object(Re.c)(
        ''.concat(Bu, '/getAlgoList'),
        (function () {
          var e = Object(F.a)(
            R.a.mark(function e(t, n) {
              var r, a
              return R.a.wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (r = n.rejectWithValue),
                          (e.prev = 1),
                          (e.next = 4),
                          Vu()
                        )
                      case 4:
                        return (a = e.sent), e.abrupt('return', a)
                      case 8:
                        return (
                          (e.prev = 8),
                          (e.t0 = e.catch(1)),
                          e.abrupt('return', r(e.t0))
                        )
                      case 11:
                      case 'end':
                        return e.stop()
                    }
                },
                e,
                null,
                [[1, 8]],
              )
            }),
          )
          return function (t, n) {
            return e.apply(this, arguments)
          }
        })(),
      )
      function Ku(e) {
        return Zu.apply(this, arguments)
      }
      function Zu() {
        return (Zu = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2), Te.get(''.concat(_e, '/params/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Gu = Object(Re.c)(
          ''.concat(At, '/addAlgorithmNode'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.name), (e.prev = 1), (e.next = 4), Ku(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        qu = Object(Re.b)(''.concat(At, '/addInputNode')),
        Yu = n(852),
        Xu = Object(Yu.a)('0123456789abcdefghijklmnopqrstuvwxyz', 10),
        $u = function () {
          return Xu()
        },
        Ju = 'input_0',
        Qu = { width: 180, height: 100, padding: 0, borderRadius: 0 },
        es = { border: '1px solid #777', height: 120 },
        ts = 'ImageFileNode',
        ns = 'CsvFileNode',
        rs = 'HDF5FileNode',
        as = 'FluoFileNode',
        cs = 'AlgorithmNode',
        is = 'BehaviorFileNode',
        os = 'TREE_ITEM',
        us = u.a.memo(function () {
          var e = Object(z.b)(),
            t = Object(z.c)(Wu),
            n = Object(z.c)(Au)
          Object(o.useEffect)(
            function () {
              n || e(Hu())
            },
            [e, n],
          )
          var r = u.a.useCallback(
            function (t, n, r) {
              var a = t,
                c = {
                  id: ''.concat(a, '_').concat($u()),
                  type: cs,
                  data: { label: a, type: Bt },
                  position: r,
                }
              e(Gu({ node: c, name: a, functionPath: n }))
            },
            [e],
          )
          return Object(I.jsxs)(ku.a, {
            sx: { flexGrow: 1, height: '100%' },
            defaultCollapseIcon: Object(I.jsx)(Pu.a, {}),
            defaultExpandIcon: Object(I.jsx)(Eu.a, {}),
            children: [
              Object(I.jsxs)(Cu.a, {
                nodeId: 'Data',
                label: 'Data',
                children: [
                  Object(I.jsx)(ss, {
                    fileName: 'image',
                    nodeName: 'imageData',
                    fileType: Xn,
                  }),
                  Object(I.jsx)(ss, {
                    fileName: 'csv',
                    nodeName: 'csvData',
                    fileType: Yn,
                  }),
                  Object(I.jsx)(ss, {
                    fileName: 'hdf5',
                    nodeName: 'hdf5Data',
                    fileType: $n,
                  }),
                  Object(I.jsx)(ss, {
                    fileName: 'fluo',
                    nodeName: 'fluoData',
                    fileType: Jn,
                  }),
                  Object(I.jsx)(ss, {
                    fileName: 'behavior',
                    nodeName: 'behaviorData',
                    fileType: Qn,
                  }),
                ],
              }),
              Object(I.jsx)(Cu.a, {
                nodeId: 'Algorithm',
                label: 'Algorithm',
                children: Object.entries(t).map(function (e, t) {
                  var n = Object(N.a)(e, 2),
                    a = n[0],
                    c = n[1]
                  return Object(I.jsx)(
                    ls,
                    { name: a, node: c, onAddAlgoNode: r },
                    t.toFixed(),
                  )
                }),
              }),
            ],
          })
        }),
        ss = u.a.memo(function (e) {
          var t = e.fileName,
            n = e.nodeName,
            r = e.fileType,
            a = Object(z.b)(),
            c = u.a.useCallback(
              function (e, t, n, r) {
                var c = ''
                switch (n) {
                  case Yn:
                    c = ns
                    break
                  case Xn:
                    ;(c = ts), (n = Xn)
                    break
                  case $n:
                    ;(c = rs), (n = $n)
                    break
                  case Jn:
                    ;(c = as), (n = Jn)
                    break
                  case Qn:
                    ;(c = is), (n = Qn)
                }
                var i = {
                  id: 'input_'.concat($u()),
                  type: c,
                  data: { label: t, type: e },
                  position: r,
                }
                a(qu({ node: i, fileType: n }))
              },
              [a],
            ),
            i = ps(
              u.a.useCallback(
                function (e) {
                  c(Wt, n, r, e)
                },
                [c, n, r],
              ),
            ),
            o = i.isDragging,
            s = i.dragRef
          return Object(I.jsx)(js, {
            ref: s,
            style: { opacity: o ? 0.6 : 1 },
            onFocusCapture: function (e) {
              return e.stopPropagation()
            },
            nodeId: t,
            label: Object(I.jsx)(fs, {
              name: t,
              onClick: function () {
                return c(Wt, n, r)
              },
            }),
          })
        }),
        ls = u.a.memo(function (e) {
          var t = e.name,
            n = e.node,
            r = e.onAddAlgoNode
          return Ru(n)
            ? Object(I.jsx)(ds, { name: t, node: n, onAddAlgoNode: r })
            : Object(I.jsx)(Cu.a, {
                nodeId: t,
                label: t,
                children: Object.entries(n.children).map(function (e, t) {
                  var n = Object(N.a)(e, 2),
                    a = n[0],
                    c = n[1]
                  return Object(I.jsx)(
                    ls,
                    { name: a, node: c, onAddAlgoNode: r },
                    t.toFixed(),
                  )
                }),
              })
        }),
        ds = u.a.memo(function (e) {
          var t = e.name,
            n = e.node,
            r = e.onAddAlgoNode,
            a = ps(
              u.a.useCallback(
                function (e) {
                  r(t, n.functionPath, e)
                },
                [r, t, n],
              ),
            ),
            c = a.isDragging,
            i = a.dragRef
          return Object(I.jsx)(js, {
            ref: i,
            style: { opacity: c ? 0.6 : 1 },
            onFocusCapture: function (e) {
              return e.stopPropagation()
            },
            nodeId: t,
            label: Object(I.jsx)(fs, {
              name: t,
              onClick: function () {
                return r(t, n.functionPath)
              },
            }),
          })
        }),
        fs = u.a.memo(function (e) {
          var t = e.name,
            n = e.onClick
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                'aria-label': 'add',
                style: { padding: 2 },
                size: 'large',
                children: Object(I.jsx)(Nu.a, {
                  onClick: function () {
                    return n()
                  },
                }),
              }),
              Object(I.jsx)(O.a, {
                variant: 'inherit',
                style: {
                  textOverflow: 'ellipsis',
                  overflow: 'visible',
                  width: '8rem',
                  display: 'inline-block',
                },
                children: t,
              }),
            ],
          })
        }),
        js = Object(x.a)(Cu.a)(
          Object(H.a)({}, '& .'.concat(Su.a.iconContainer), {
            margin: 0,
            width: 0,
          }),
        )
      function ps(e) {
        var t = Object(Du.a)(
            function () {
              return {
                type: os,
                end: function (t, n) {
                  var r,
                    a =
                      null === (r = n.getDropResult()) || void 0 === r
                        ? void 0
                        : r.position
                  n.didDrop() && null != a && e(a)
                },
                collect: function (e) {
                  return { isDragging: e.isDragging() }
                },
              }
            },
            [e],
          ),
          n = Object(N.a)(t, 2)
        return { isDragging: n[0].isDragging, dragRef: n[1] }
      }
      var bs = n(1768),
        hs = (n(945), Object(Re.b)(''.concat(qn, '/setInputNodeFilePath')))
      function ms(e) {
        return (function (e) {
          var t
          return (
            Vt(e) &&
            (null === (t = e.data) || void 0 === t ? void 0 : t.type) === Wt
          )
        })(e)
      }
      function xs(e) {
        return Ut(e)
      }
      var Os = 'image',
        vs = 'csv',
        gs = 'hdf5',
        ys = 'all'
      function ws(e) {
        return Is.apply(this, arguments)
      }
      function Is() {
        return (Is = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.get(''.concat(_e, '/files'), {
                        params: { file_type: t },
                      })
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      function ks(e, t, n) {
        return Cs.apply(this, arguments)
      }
      function Cs() {
        return (Cs = Object(F.a)(
          R.a.mark(function e(t, n, r) {
            var a
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      Te.post(''.concat(_e, '/files/upload/').concat(t), r, n)
                    )
                  case 2:
                    return (a = e.sent), e.abrupt('return', a.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Ss = 'fileUploader',
        _s = Object(Re.b)(''.concat(Ss, '/setUploadProgress')),
        Ps = Object(Re.c)(
          ''.concat(Ss, '/uploadFile'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c, i, o
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = t.requestId),
                            (a = t.fileName),
                            (c = t.formData),
                            (e.prev = 1),
                            (i = Ts(function (e, t) {
                              n.dispatch(
                                _s({ requestId: r, progess: e, total: t }),
                              )
                            })),
                            (e.next = 5),
                            ks(a, i, c)
                          )
                        case 5:
                          return (
                            (o = e.sent),
                            e.abrupt('return', { resultPath: o.file_path })
                          )
                        case 9:
                          return (
                            (e.prev = 9),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 12:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 9]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        )
      function Ts(e) {
        return {
          onUploadProgress: function (t) {
            var n = Math.round((100 * t.loaded) / t.total)
            e(n, t.total)
          },
        }
      }
      var Es = { x: 0, y: 0, zoom: 0.7 },
        Fs = { x: 100, y: 150 },
        Ns = {
          flowElements: [
            {
              id: Ju,
              type: ts,
              data: { type: Wt, label: 'NoName' },
              style: es,
              position: { x: 50, y: 150 },
            },
          ],
          flowPosition: Es,
          elementCoord: Fs,
        },
        Ds = Object(Re.d)({
          name: At,
          initialState: Ns,
          reducers: {
            setFlowPosition: function (e, t) {
              e.flowPosition = t.payload
            },
            setFlowElements: function (e, t) {
              e.flowElements = t.payload
            },
            deleteFlowElements: function (e, t) {
              e.flowElements = Object(Et.l)(t.payload, e.flowElements)
            },
            deleteFlowElementsById: function (e, t) {
              var n = e.flowElements.find(function (e) {
                return e.id === t.payload
              })
              void 0 !== n &&
                (e.flowElements = Object(Et.l)([n], e.flowElements))
            },
            editFlowElementPositionById: function (e, t) {
              var n = t.payload,
                r = n.nodeId,
                a = n.coord,
                c = e.flowElements.findIndex(function (e) {
                  return e.id === r
                }),
                i = e.flowElements[c]
              Object(Et.k)(i) && (i.position = a)
            },
          },
          extraReducers: function (e) {
            return e
              .addCase(Gu.fulfilled, function (e, t) {
                var n,
                  r = t.meta.arg.node
                ;(null === (n = r.data) || void 0 === n ? void 0 : n.type) ===
                  Bt &&
                  (r = Object(K.a)(
                    Object(K.a)({}, r),
                    {},
                    {
                      style: Object(K.a)(Object(K.a)({}, r.style), Qu),
                      targetPosition: Et.c.Left,
                      sourcePosition: Et.c.Right,
                    },
                  )),
                  null != r.position
                    ? e.flowElements.push(
                        Object(K.a)(
                          Object(K.a)({}, r),
                          {},
                          { position: r.position },
                        ),
                      )
                    : (e.flowElements.push(
                        Object(K.a)(
                          Object(K.a)({}, r),
                          {},
                          { position: e.elementCoord },
                        ),
                      ),
                      Rs(e))
              })
              .addCase(qu, function (e, t) {
                var n,
                  r = t.payload.node
                ;(null === (n = r.data) || void 0 === n ? void 0 : n.type) ===
                  Wt &&
                  (r = Object(K.a)(
                    Object(K.a)({}, r),
                    {},
                    {
                      style: Object(K.a)(Object(K.a)({}, r.style), es),
                      targetPosition: Et.c.Left,
                      sourcePosition: Et.c.Right,
                    },
                  )),
                  null != r.position
                    ? e.flowElements.push(
                        Object(K.a)(
                          Object(K.a)({}, r),
                          {},
                          { position: r.position },
                        ),
                      )
                    : (e.flowElements.push(
                        Object(K.a)(
                          Object(K.a)({}, r),
                          {},
                          { position: e.elementCoord },
                        ),
                      ),
                      Rs(e))
              })
              .addCase(hs, function (e, t) {
                var n = t.payload,
                  r = n.nodeId,
                  a = Ht(n.filePath),
                  c = e.flowElements.findIndex(function (e) {
                    return e.id === r
                  }),
                  i = e.flowElements[c]
                null != i.data && (i.data.label = a)
              })
              .addCase(Ps.fulfilled, function (e, t) {
                var n = t.meta.arg.nodeId
                if (null != n) {
                  var r = e.flowElements.findIndex(function (e) {
                      return e.id === n
                    }),
                    a = e.flowElements[r]
                  null != a.data && (a.data.label = Ht(t.payload.resultPath))
                }
              })
              .addCase(Br.fulfilled, function (e, t) {
                ;(e.flowPosition = Es), (e.elementCoord = Fs)
                var n = Object.values(t.payload.nodeDict).map(function (e) {
                  var t, n, r, a, c, i, o, u
                  return ms(e)
                    ? Object(K.a)(
                        Object(K.a)({}, e),
                        {},
                        {
                          data: {
                            label:
                              null !==
                                (t =
                                  null === (n = e.data) || void 0 === n
                                    ? void 0
                                    : n.label) && void 0 !== t
                                ? t
                                : '',
                            type:
                              null !==
                                (r =
                                  null === (a = e.data) || void 0 === a
                                    ? void 0
                                    : a.type) && void 0 !== r
                                ? r
                                : 'input',
                          },
                        },
                      )
                    : Object(K.a)(
                        Object(K.a)({}, e),
                        {},
                        {
                          data: {
                            label:
                              null !==
                                (c =
                                  null === (i = e.data) || void 0 === i
                                    ? void 0
                                    : i.label) && void 0 !== c
                                ? c
                                : '',
                            type:
                              null !==
                                (o =
                                  null === (u = e.data) || void 0 === u
                                    ? void 0
                                    : u.type) && void 0 !== o
                                ? o
                                : 'algorithm',
                          },
                        },
                      )
                })
                e.flowElements = n.concat(Object.values(t.payload.edgeDict))
              })
          },
        })
      function Rs(e) {
        var t, n
        e.elementCoord.x > 800
          ? ((e.elementCoord.x = 300), (e.elementCoord.y += 100))
          : ((e.elementCoord.x += 250),
            (e.elementCoord.y +=
              ((t = -20), (n = 20), Math.random() * (n - t) + t)))
      }
      var zs = Ds.actions,
        Ls = zs.setFlowPosition,
        Ms = zs.setFlowElements,
        As = zs.deleteFlowElements,
        Ws = zs.deleteFlowElementsById,
        Bs = zs.editFlowElementPositionById,
        Vs = Ds.reducer,
        Us = n(404),
        Hs = n.n(Us)
      function Ks() {
        return Zs.apply(this, arguments)
      }
      function Zs() {
        return (Zs = Object(F.a)(
          R.a.mark(function e() {
            var t
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), Te.get(''.concat(_e, '/nwb'))
                  case 2:
                    return (t = e.sent), e.abrupt('return', t.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Gs = Object(Re.c)(
          ''.concat('NWB', '/getNWBParams'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = n.rejectWithValue),
                            (e.prev = 1),
                            (e.next = 4),
                            Ks()
                          )
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', r(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        qs = Object(Re.d)({
          name: 'NWB',
          initialState: { params: {} },
          reducers: {
            updateParam: function (e, t) {
              var n = t.payload,
                r = n.path,
                a = n.newValue,
                c = Ft(r, e.params)
              null != c && (c.value = a)
            },
          },
          extraReducers: function (e) {
            e.addCase(Gs.fulfilled, function (e, t) {
              e.params = Dt(t.payload)
            })
          },
        }),
        Ys = qs.actions.updateParam,
        Xs = qs.reducer,
        $s = 'none',
        Js = 'nwb',
        Qs = 'paramForm',
        el = 'snakemake',
        tl = { open: !1, mode: $s, currendNodeId: null },
        nl = Object(Re.d)({
          name: 'rightDrawer',
          initialState: tl,
          reducers: {
            openRightDrawer: function (e, t) {
              ;(e.open = !0), (e.mode = t.payload)
            },
            closeRightDrawer: function (e) {
              ;(e.open = !1), (e.mode = $s)
            },
            toggleParamForm: function (e, t) {
              e.open && e.mode === Qs && e.currendNodeId === t.payload
                ? ((e.open = !1), (e.mode = $s), (e.currendNodeId = null))
                : ((e.open = !0), (e.mode = Qs), (e.currendNodeId = t.payload))
            },
            toggleNwb: function (e) {
              e.open && e.mode === Js
                ? ((e.open = !1), (e.mode = $s))
                : ((e.open = !0), (e.mode = Js)),
                (e.currendNodeId = null)
            },
            toggleSnakemake: function (e) {
              e.open && e.mode === el
                ? ((e.open = !1), (e.mode = $s))
                : ((e.open = !0), (e.mode = el)),
                (e.currendNodeId = null)
            },
          },
          extraReducers: function (e) {
            e.addCase(As, function (e, t) {
              t.payload.findIndex(function (t) {
                return t.id === e.currendNodeId
              }) > 0 && (e.currendNodeId = null)
            })
              .addCase(Ws, function (e, t) {
                t.payload === e.currendNodeId && (e.currendNodeId = null)
              })
              .addCase(Br.fulfilled, function () {
                return tl
              })
          },
        }),
        rl = nl.actions,
        al = rl.toggleParamForm,
        cl = rl.toggleNwb,
        il = rl.toggleSnakemake,
        ol = (rl.openRightDrawer, rl.closeRightDrawer),
        ul = nl.reducer,
        sl = n(1689),
        ll = n(566),
        dl = n(1795),
        fl = n(1794),
        jl = n(1793),
        pl = Object(x.a)(function (e) {
          return Object(I.jsx)(
            jl.a,
            Object(K.a)({ disableGutters: !0, elevation: 0, square: !0 }, e),
          )
        })(function (e) {
          return {
            border: '1px solid',
            borderColor: e.theme.palette.divider,
            boxShadow: 'none',
            '&:not(:last-child)': { borderBottom: 0 },
            '&:before': { display: 'none' },
          }
        })
      function bl(e) {
        var t = e.paramSelector,
          n = e.paramValueSelector,
          r = e.paramUpdateActionCreator
        function a(e) {
          return [
            Object(z.c)(n(e)),
            function (t) {
              return r(e, t)
            },
          ]
        }
        var c = u.a.memo(function (e) {
            var t = e.path,
              n = Object(z.b)(),
              r = a(t),
              c = Object(N.a)(r, 2),
              i = c[0],
              u = c[1],
              s = Object(o.useRef)(Array.isArray(i))
            return Object(I.jsx)(ll.a, {
              value: i,
              onChange: function (e) {
                var t = e.target.value
                n(u(t))
              },
              multiline: !0,
              onBlur: s
                ? function (e) {
                    var t = e.target.value
                    n(
                      u(
                        t
                          .split(',')
                          .filter(Boolean)
                          .map(function (e) {
                            return Number(e)
                          }),
                      ),
                    )
                  }
                : void 0,
            })
          }),
          i = u.a.memo(function (e) {
            var t = e.path,
              n = Object(z.b)(),
              r = a(t),
              c = Object(N.a)(r, 2),
              i = c[0],
              o = c[1]
            if ('number' === typeof i) {
              return Object(I.jsx)(ll.a, {
                type: 'number',
                InputLabelProps: { shrink: !0 },
                value: i,
                onChange: function (e) {
                  var t = '' === e.target.value ? '' : Number(e.target.value)
                  'number' === typeof t && n(o(t))
                },
              })
            }
            return null
          }),
          s = u.a.memo(function (e) {
            var t = e.path,
              n = Object(z.b)(),
              r = a(t),
              c = Object(N.a)(r, 2),
              i = c[0],
              o = c[1]
            if ('boolean' === typeof i) {
              return Object(I.jsx)(sl.a, {
                checked: i,
                onChange: function () {
                  n(o(!i))
                },
              })
            }
            return null
          }),
          l = u.a.memo(function (e) {
            var t = e.path,
              n = a(t),
              r = Object(N.a)(n, 1)[0]
            return 'number' === typeof r
              ? Object(I.jsx)(i, { path: t })
              : 'string' === typeof r
              ? Object(I.jsx)(c, { path: t })
              : 'boolean' === typeof r
              ? Object(I.jsx)(s, { path: t })
              : Object(I.jsx)(c, { path: t })
          }),
          d = u.a.memo(function (e) {
            var t = e.path,
              n = e.name
            return Object(I.jsxs)(m.a, {
              sx: {
                display: 'flex',
                marginTop: function (e) {
                  return e.spacing(2)
                },
                marginBottom: function (e) {
                  return e.spacing(2)
                },
                alignItems: 'center',
                overflow: 'scroll',
              },
              children: [
                Object(I.jsx)(m.a, {
                  style: { verticalAlign: 'middle' },
                  sx: { flexGrow: 1, width: '50%' },
                  children: Object(I.jsx)(O.a, {
                    style: { overflow: 'scroll' },
                    children: n,
                  }),
                }),
                Object(I.jsx)(m.a, {
                  sx: { width: '50%' },
                  children: Object(I.jsx)(l, { path: t }),
                }),
              ],
            })
          }),
          f = u.a.memo(function (e) {
            var t = e.paramKey,
              n = e.param
            return Nt(n)
              ? Object(I.jsx)(d, { path: n.path, name: t })
              : Object(I.jsxs)(pl, {
                  children: [
                    Object(I.jsx)(fl.a, {
                      expandIcon: Object(I.jsx)(Pu.a, {}),
                      children: t,
                    }),
                    Object(I.jsx)(dl.a, {
                      children: Object(I.jsx)('div', {
                        children: Object.entries(n.children).map(
                          function (e, t) {
                            var n = Object(N.a)(e, 2),
                              r = n[0],
                              a = n[1]
                            return Object(I.jsx)(f, { param: a, paramKey: r })
                          },
                        ),
                      }),
                    }),
                  ],
                })
          })
        return u.a.memo(function (e) {
          var n = e.paramKey,
            r = Object(z.c)(t(n))
          return Object(I.jsx)(f, { paramKey: n, param: r })
        })
      }
      var hl = u.a.memo(function () {
          var e = Object(z.b)()
          return Object(I.jsx)(G.a, {
            variant: 'outlined',
            onClick: function () {
              e(cl())
            },
            sx: {
              margin: function (e) {
                return e.spacing(1)
              },
            },
            endIcon: Object(I.jsx)(Hs.a, {}),
            children: 'NWB setting',
          })
        }),
        ml = u.a.memo(function () {
          var e = Object(z.b)(),
            t = Object(z.c)(Jt, La)
          return (
            Object(o.useEffect)(function () {
              0 === t.length && e(Gs())
            }),
            Object(I.jsx)('div', {
              className: 'nwbParam',
              style: { margin: 4 },
              children: t.map(function (e, t) {
                return Object(I.jsx)(xl, { paramKey: e }, t)
              }),
            })
          )
        }),
        xl = u.a.memo(function (e) {
          var t = e.paramKey,
            n = bl({
              paramSelector: Qt,
              paramValueSelector: en,
              paramUpdateActionCreator: function (e, t) {
                return Ys({ path: e, newValue: t })
              },
            })
          return Object(I.jsx)(n, { paramKey: t })
        })
      function Ol() {
        return vl.apply(this, arguments)
      }
      function vl() {
        return (vl = Object(F.a)(
          R.a.mark(function e() {
            var t
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), Te.get(''.concat(_e, '/snakemake'))
                  case 2:
                    return (t = e.sent), e.abrupt('return', t.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var gl = 'Snakemake',
        yl = Object(Re.c)(
          ''.concat(gl, '/getSnakemakeParams'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = n.rejectWithValue),
                            (e.prev = 1),
                            (a = Ol()),
                            e.abrupt('return', a)
                          )
                        case 6:
                          return (
                            (e.prev = 6),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', r(e.t0))
                          )
                        case 9:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 6]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        wl = Object(Re.d)({
          name: gl,
          initialState: { params: {} },
          reducers: {
            updateParam: function (e, t) {
              var n = t.payload,
                r = n.path,
                a = n.newValue,
                c = Ft(r, e.params)
              null != c && (c.value = a)
            },
          },
          extraReducers: function (e) {
            e.addCase(yl.fulfilled, function (e, t) {
              e.params = Dt(t.payload)
            })
          },
        }),
        Il = wl.actions.updateParam,
        kl = wl.reducer,
        Cl = u.a.memo(function () {
          var e = Object(z.b)()
          return Object(I.jsx)(G.a, {
            variant: 'outlined',
            onClick: function () {
              e(il())
            },
            sx: {
              margin: function (e) {
                return e.spacing(1)
              },
            },
            endIcon: Object(I.jsx)(Hs.a, {}),
            children: 'Snakemake',
          })
        }),
        Sl = u.a.memo(function () {
          var e = Object(z.b)(),
            t = Object(z.c)(Kn, La)
          return (
            Object(o.useEffect)(function () {
              0 === t.length && e(yl())
            }),
            Object(I.jsx)('div', {
              className: 'SnakemakeParam',
              style: { margin: 4 },
              children: t.map(function (e, t) {
                return Object(I.jsx)(_l, { paramKey: e }, t)
              }),
            })
          )
        }),
        _l = u.a.memo(function (e) {
          var t = e.paramKey,
            n = bl({
              paramSelector: Zn,
              paramValueSelector: Gn,
              paramUpdateActionCreator: function (e, t) {
                return Il({ path: e, newValue: t })
              },
            })
          return Object(I.jsx)(n, { paramKey: t })
        }),
        Pl = n(1796),
        Tl = n(854),
        El = n.n(Tl),
        Fl = n(561),
        Nl = n(1687),
        Dl = n(562),
        Rl = n(116),
        zl = n(419),
        Ll = n(1797),
        Ml = u.a.memo(function (e) {
          var t = e.uid,
            n = e.isStartedSuccess,
            r = e.filePathIsUndefined,
            a = e.algorithmNodeNotExist,
            c = e.handleCancelPipeline,
            i = e.handleRunPipeline,
            o = e.handleRunPipelineByUid,
            s = Object(z.b)(),
            l = Object(z.c)(Rn),
            d = u.a.useState(!1),
            f = Object(N.a)(d, 2),
            b = f[0],
            h = f[1],
            m = Object(p.b)().enqueueSnackbar,
            x = u.a.useState(!1),
            O = Object(N.a)(x, 2),
            v = O[0],
            g = O[1],
            y = u.a.useRef(null),
            w = function (e) {
              ;(y.current && y.current.contains(e.target)) || g(!1)
            },
            k = null != t
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsxs)(Pl.a, {
                sx: { margin: 1 },
                variant: 'contained',
                ref: y,
                disabled: n,
                children: [
                  Object(I.jsx)(G.a, {
                    onClick: function () {
                      var e = null
                      a &&
                        (e =
                          'please add some algorithm nodes to the flowchart'),
                        r && (e = 'please select input file'),
                        null != e
                          ? m(e, { variant: 'error' })
                          : l === jn.RUN_NEW
                          ? h(!0)
                          : o()
                    },
                    children: pn[l],
                  }),
                  Object(I.jsx)(G.a, {
                    size: 'small',
                    onClick: function () {
                      g(function (e) {
                        return !e
                      })
                    },
                    children: Object(I.jsx)(El.a, {}),
                  }),
                ],
              }),
              Object(I.jsx)(Dl.a, {
                open: v,
                anchorEl: y.current,
                role: void 0,
                transition: !0,
                disablePortal: !0,
                children: function (e) {
                  var t = e.TransitionProps,
                    n = e.placement
                  return Object(I.jsx)(
                    Nl.a,
                    Object(K.a)(
                      Object(K.a)({}, t),
                      {},
                      {
                        style: {
                          transformOrigin:
                            'bottom' === n ? 'center top' : 'center bottom',
                        },
                        children: Object(I.jsx)(ia.a, {
                          children: Object(I.jsx)(Fl.a, {
                            onClickAway: w,
                            children: Object(I.jsx)(zl.a, {
                              children: Object.values(jn).map(function (e) {
                                return Object(I.jsx)(
                                  Rl.a,
                                  {
                                    disabled: !k && e === jn.RUN_ALREADY,
                                    selected: e === l,
                                    onClick: function (t) {
                                      return (function (e, t) {
                                        s(Zr({ runBtnOption: t })), g(!1)
                                      })(0, e)
                                    },
                                    children: pn[e],
                                  },
                                  e,
                                )
                              }),
                            }),
                          }),
                        }),
                      },
                    ),
                  )
                },
              }),
              Object(I.jsx)(G.a, {
                variant: 'outlined',
                endIcon: Object(I.jsx)(j.a, {}),
                onClick: function () {
                  c()
                },
                sx: { margin: 1, marginRight: 4 },
                children: 'Cancel',
              }),
              Object(I.jsx)(Al, {
                open: b,
                handleRun: function (e) {
                  i(e), h(!1)
                },
                handleClose: function () {
                  return h(!1)
                },
              }),
            ],
          })
        }),
        Al = u.a.memo(function (e) {
          var t = e.open,
            n = e.handleClose,
            r = e.handleRun,
            a = u.a.useState('New flow'),
            c = Object(N.a)(a, 2),
            i = c[0],
            o = c[1],
            s = u.a.useState(null),
            l = Object(N.a)(s, 2),
            d = l[0],
            f = l[1]
          return Object(I.jsxs)(ha.a, {
            open: t,
            onClose: n,
            children: [
              Object(I.jsx)(xa.a, { children: 'Name and run flowchart' }),
              Object(I.jsx)(Ll.a, {
                children: Object(I.jsx)(ll.a, {
                  label: 'name',
                  autoFocus: !0,
                  margin: 'dense',
                  fullWidth: !0,
                  variant: 'standard',
                  onChange: function (e) {
                    o(e.target.value), '' !== e.target.value && f(null)
                  },
                  error: null != d,
                  helperText: d,
                  value: i,
                }),
              }),
              Object(I.jsxs)(ma.a, {
                children: [
                  Object(I.jsx)(G.a, {
                    onClick: n,
                    color: 'inherit',
                    variant: 'outlined',
                    children: 'Cancel',
                  }),
                  Object(I.jsx)(G.a, {
                    onClick: function () {
                      '' !== i ? r(i) : f('name is empty')
                    },
                    color: 'primary',
                    variant: 'outlined',
                    children: 'Run',
                  }),
                ],
              }),
            ],
          })
        }),
        Wl = u.a.memo(function (e) {
          return Object(I.jsxs)(m.a, {
            style: {
              position: 'absolute',
              float: 'right',
              textAlign: 'right',
              top: -7,
              right: 10,
              zIndex: 4,
              textTransform: 'none',
            },
            children: [
              Object(I.jsx)(Cl, {}),
              Object(I.jsx)(hl, {}),
              Object(I.jsx)(Ml, Object(K.a)({}, e)),
            ],
          })
        }),
        Bl = n(68),
        Vl = n(62)
      function Ul(e) {
        var t
        return Object(z.c)(
          ((t = e),
          function (e) {
            return null != e.handleColor.colorMap[t]
              ? e.handleColor.colorMap[t]
              : void 0
          }),
        )
      }
      var Hl = n(1798),
        Kl = u.a.memo(function (e) {
          return Object(I.jsxs)(m.a, {
            display: 'flex',
            alignItems: 'center',
            children: [
              Object(I.jsx)(m.a, {
                width: '100%',
                mr: 1,
                children: Object(I.jsx)(
                  Hl.a,
                  Object(K.a)({ variant: 'determinate' }, e),
                ),
              }),
              Object(I.jsx)(m.a, {
                minWidth: 35,
                children: Object(I.jsx)(O.a, {
                  variant: 'body2',
                  color: 'textSecondary',
                  children: ''.concat(Math.round(e.value), '%'),
                }),
              }),
            ],
          })
        }),
        Zl = {
          path: void 0,
          fileName: void 0,
          isUninitialized: !0,
          pending: !1,
          fulfilled: !1,
          uploadingProgress: void 0,
          error: void 0,
        },
        Gl = function (e) {
          return function (t) {
            return Object.keys(t.fileUploader).includes(e)
              ? t.fileUploader[e]
              : Zl
          }
        }
      function ql(e) {
        var t = e.fileType,
          n = e.nodeId,
          r = Object(z.b)(),
          a = u.a.useRef(Object(Re.f)()),
          c = u.a.useCallback(
            function (e, c) {
              r(
                Ps({
                  requestId: a.current,
                  nodeId: n,
                  fileName: c,
                  formData: e,
                  fileType: t,
                }),
              )
            },
            [r, t, n],
          ),
          i = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).isUninitialized
              }
            })(a.current),
          ),
          o = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).path
              }
            })(a.current),
          ),
          s = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).pending
              }
            })(a.current),
          ),
          l = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).fulfilled
              }
            })(a.current),
          ),
          d = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).uploadingProgress
              }
            })(a.current),
          ),
          f = Object(z.c)(
            (function (e) {
              return function (t) {
                return Gl(e)(t).error
              }
            })(a.current),
          )
        return {
          filePath: o,
          uninitialized: i,
          pending: s,
          fulfilled: l,
          progress: d,
          error: f,
          onUploadFile: c,
        }
      }
      var Yl = Object(o.createContext)({
          onOpen: function () {
            return null
          },
          onOpenDialogFile: function () {
            return null
          },
          onMessageError: function () {
            return null
          },
        }),
        Xl = u.a.memo(function (e) {
          var t = e.multiSelect,
            n = void 0 !== t && t,
            r = e.filePath,
            a = e.nodeId,
            c = e.fileType,
            i = e.onChangeFilePath,
            o = ql({ fileType: c, nodeId: a }),
            u = o.onUploadFile,
            s = o.pending,
            l = o.uninitialized,
            d = o.progress,
            f = o.error
          return Object(I.jsxs)(I.Fragment, {
            children: [
              !l &&
                s &&
                null != d &&
                Object(I.jsx)('div', {
                  style: { marginLeft: 2, marginRight: 2 },
                  children: Object(I.jsx)(Kl, { value: d }),
                }),
              Object(I.jsx)($l, {
                multiSelect: n,
                filePath: r,
                onSelectFile: i,
                onUploadFile: function (e, t) {
                  u(e, t)
                },
                fileTreeType: c,
                selectButtonLabel: 'Select '.concat(c),
              }),
              null != f &&
                Object(I.jsx)(O.a, {
                  variant: 'caption',
                  color: 'error',
                  children: f,
                }),
            ],
          })
        }),
        $l = u.a.memo(function (e) {
          var t = e.multiSelect,
            n = void 0 !== t && t,
            r = e.filePath,
            a = e.onSelectFile,
            c = e.onUploadFile,
            i = e.fileTreeType,
            s = e.selectButtonLabel,
            l = e.uploadButtonLabel,
            d = Object(o.useContext)(Yl).onOpenDialogFile,
            f = u.a.useRef(null),
            j = (function (e) {
              switch (e) {
                case Os:
                  return '.tif,.tiff'
                case vs:
                  return '.csv'
                case gs:
                  return '.hdf5,.nwb'
                default:
                  return
              }
            })(i),
            p = Ht(r)
          return Object(I.jsxs)('div', {
            style: { padding: 5 },
            children: [
              Object(I.jsxs)(Pl.a, {
                size: 'small',
                style: { marginRight: 4 },
                children: [
                  Object(I.jsx)(G.a, {
                    variant: 'outlined',
                    onClick: function () {
                      d({
                        open: !0,
                        multiSelect: n,
                        filePath: r,
                        fileTreeType: i,
                        onSelectFile: a,
                      })
                    },
                    children: s || 'Select File',
                  }),
                  Object(I.jsx)(G.a, {
                    onClick: function () {
                      null != f.current && f.current.click()
                    },
                    variant: 'outlined',
                    children: l || 'Load',
                  }),
                ],
              }),
              Object(I.jsxs)('div', {
                children: [
                  Object(I.jsx)('input', {
                    ref: f,
                    type: 'file',
                    onChange: function (e) {
                      if (
                        (e.preventDefault(),
                        null != e.target.files && null != e.target.files[0])
                      ) {
                        var t = e.target.files[0],
                          n = new FormData()
                        n.append('file', t)
                        var r = t.name
                        c(n, r)
                      }
                    },
                    accept: j,
                    style: { visibility: 'hidden', width: 0, height: 0 },
                  }),
                  Object(I.jsx)(O.a, {
                    className: 'selectFilePath',
                    variant: 'caption',
                    children: p || 'No file is selected.',
                  }),
                ],
              }),
            ],
          })
        })
      function Jl(e, t, n) {
        return ''.concat(e, '--').concat(t, '--').concat(n)
      }
      function Ql(e) {
        return e.split('--')[2]
      }
      function ed(e) {
        return (
          null == e.sourceHandle ||
          null == e.targetHandle ||
          Ql(e.sourceHandle) === Ql(e.targetHandle)
        )
      }
      var td = {
          width: '4%',
          height: '13%',
          top: 15,
          border: '1px solid',
          borderRadius: 0,
        },
        nd = u.a.memo(function (e) {
          return Object(z.c)(rr(e.id))
            ? Object(I.jsx)(rd, Object(K.a)({}, e))
            : null
        }),
        rd = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = Object(z.b)(),
            a = Object(z.c)(cr(t), function (e, t) {
              return null != e && null != t ? La(e, t) : e === t
            }),
            c = Object(Bl.a)(),
            i = 'ImageData',
            o = Ul(i)
          return Object(I.jsxs)('div', {
            style: {
              height: '100%',
              width: '250px',
              background: n
                ? Object(Vl.a)(c.palette.primary.light, 0.1)
                : void 0,
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  r(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(Xl, {
                nodeId: t,
                multiSelect: !0,
                onChangeFilePath: function (e) {
                  Array.isArray(e) &&
                    (function (e) {
                      r(hs({ nodeId: t, filePath: e }))
                    })(e)
                },
                fileType: Xn,
                filePath: null !== a && void 0 !== a ? a : [],
              }),
              Object(I.jsx)(Et.b, {
                type: 'source',
                position: Et.c.Right,
                id: Jl(t, 'image', i),
                style: Object(K.a)(Object(K.a)({}, td), {}, { background: o }),
                isValidConnection: ed,
              }),
            ],
          })
        }),
        ad = n(1703),
        cd = n(856),
        id = n.n(cd),
        od = n(855),
        ud = n.n(od),
        sd = {
          width: '4%',
          height: '13%',
          border: '1px solid',
          borderRadius: 0,
        },
        ld = {
          width: '4%',
          height: '13%',
          border: '1px solid',
          borderRadius: 0,
        },
        dd = u.a.memo(function (e) {
          var t
          return Object(z.c)(
            ((t = e.id),
            function (e) {
              return Object.keys(e.algorithmNode).includes(t)
            }),
          )
            ? Object(I.jsx)(fd, Object(K.a)({}, e))
            : null
        }),
        fd = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = e.isConnectable,
            a = e.data,
            c = Object(o.useContext)(Yl).onOpen,
            i = Object(Bl.a)(),
            u = Object(z.b)(),
            s = vd(t)
          return Object(I.jsxs)('div', {
            tabIndex: 0,
            style: {
              width: '100%',
              height: '110%',
              background: n
                ? Object(Vl.a)(i.palette.primary.light, 0.15)
                : void 0,
              border: '1px solid',
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  u(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(jd, { nodeId: t, data: a }),
              Object(I.jsxs)(Pl.a, {
                sx: { mx: 1 },
                children: [
                  Object(I.jsx)(G.a, {
                    size: 'small',
                    onClick: function () {
                      u(al(t))
                    },
                    children: 'Param',
                  }),
                  Object(I.jsx)(G.a, {
                    size: 'small',
                    onClick: function () {
                      c(t)
                    },
                    disabled: s !== ln,
                    children: 'Output',
                  }),
                ],
              }),
              Object(I.jsx)(pd, { nodeId: t }),
              Object(I.jsx)(bd, { nodeId: t, isConnectable: r }),
              Object(I.jsx)(xd, { nodeId: t }),
            ],
          })
        }),
        jd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = e.data,
            r = Object(Bl.a)(),
            a = vd(t),
            c = Object(z.c)(Mn)
          return Object(I.jsxs)('div', {
            style: { padding: 8, paddingLeft: 8, width: '100%' },
            className: 'algoName',
            children: [
              c === cn && a === fn && Object(I.jsx)(Hl.a, {}),
              Object(I.jsx)(O.a, {
                style: {
                  textAlign: 'left',
                  color: a === dn ? r.palette.error.main : void 0,
                },
                children: n.label,
              }),
            ],
          })
        }),
        pd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = zt(e)(t)
                  if (null != n) {
                    var r = zu(Wu(t), n)
                    return null === r || void 0 === r ? void 0 : r.args
                  }
                }
              })(t),
              Od,
            )
          return Object(I.jsx)(I.Fragment, {
            children:
              null != n
                ? n
                    .filter(function (e) {
                      return 'params' !== e.type
                    })
                    .map(function (e, n) {
                      return Object(I.jsx)(hd, { algoInfo: e, i: n, nodeId: t })
                    })
                : null,
          })
        }),
        bd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = e.isConnectable,
            r = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = zt(e)(t)
                  if (null != n) {
                    var r = zu(Wu(t), n)
                    return null === r || void 0 === r ? void 0 : r.returns
                  }
                }
              })(t),
              Od,
            )
          return Object(I.jsx)(I.Fragment, {
            children:
              null != r
                ? null === r || void 0 === r
                  ? void 0
                  : r.map(function (e, n) {
                      return Object(I.jsx)(md, { algoInfo: e, i: n, nodeId: t })
                    })
                : Object(I.jsx)(Et.b, {
                    type: 'source',
                    position: Et.c.Right,
                    id: ''.concat(t),
                    style: Object(K.a)(Object(K.a)({}, ld), {}, { top: 15 }),
                    isConnectable: n,
                  }),
          })
        })
      var hd = u.a.memo(function (e) {
          var t = e.algoInfo,
            n = t.name,
            r = t.type,
            a = t.isNone,
            c = e.nodeId,
            i = e.i,
            o = Ul(r),
            s = Jl(c, n, r),
            l = u.a.useState(!1),
            d = Object(N.a)(l, 2),
            f = d[0],
            j = d[1],
            p = (function (e, t) {
              if (void 0 !== e) {
                var n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e)
                return null !== n
                  ? t
                    ? 'rgba('
                        .concat(parseInt(n[1], 16), ', ')
                        .concat(parseInt(n[2], 16), ', ')
                        .concat(parseInt(n[3], 16), ', 0.55)')
                    : 'rgba('
                        .concat(parseInt(n[1], 16), ', ')
                        .concat(parseInt(n[2], 16), ', ')
                        .concat(parseInt(n[3], 16), ', 1)')
                  : void 0
              }
            })(o, a)
          return Object(I.jsx)(
            Et.b,
            {
              onMouseEnter: function () {
                return j(!0)
              },
              onMouseLeave: function () {
                return j(!1)
              },
              type: 'target',
              position: Et.c.Left,
              id: s,
              style: Object(K.a)(
                Object(K.a)({}, sd),
                {},
                { background: p, top: 25 * i + 15 },
              ),
              isValidConnection: ed,
              children: Object(I.jsx)(ad.a, {
                title: Object(I.jsxs)(I.Fragment, {
                  children: [
                    Object(I.jsxs)(O.a, {
                      color: 'inherit',
                      children: ['name: ', n],
                    }),
                    Object(I.jsxs)(O.a, {
                      color: 'inherit',
                      children: ['type: ', r],
                    }),
                  ],
                }),
                open: f,
                placement: 'left-end',
                arrow: !0,
                children: Object(I.jsx)('div', {}),
              }),
            },
            i.toFixed(),
          )
        }),
        md = u.a.memo(function (e) {
          var t = e.algoInfo,
            n = t.name,
            r = t.type,
            a = e.nodeId,
            c = e.i,
            i = Ul(r),
            o = Jl(a, n, r),
            s = u.a.useState(!1),
            l = Object(N.a)(s, 2),
            d = l[0],
            f = l[1]
          return Object(I.jsx)(
            Et.b,
            {
              onMouseEnter: function () {
                return f(!0)
              },
              onMouseLeave: function () {
                return f(!1)
              },
              type: 'source',
              position: Et.c.Right,
              id: o,
              style: Object(K.a)(
                Object(K.a)({}, ld),
                {},
                { background: i, top: 25 * c + 15 },
              ),
              isValidConnection: ed,
              children: Object(I.jsx)(ad.a, {
                title: Object(I.jsxs)(I.Fragment, {
                  children: [
                    Object(I.jsxs)(O.a, {
                      color: 'inherit',
                      children: ['name: ', n],
                    }),
                    Object(I.jsxs)(O.a, {
                      color: 'inherit',
                      children: ['type: ', r],
                    }),
                  ],
                }),
                open: d,
                placement: 'right-end',
                arrow: !0,
                children: Object(I.jsx)('div', {}),
              }),
            },
            c.toFixed(),
          )
        }),
        xd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = vd(t),
            r = Object(z.c)(Nn),
            a = Object(z.c)(function (e) {
              var n
              return null != r &&
                null !==
                  (n = (function (e) {
                    return function (t) {
                      var n = Dn(t)
                      return Tn(n) && Object.keys(n.runResult).includes(e)
                        ? n.runResult[e].message
                        : null
                    }
                  })(t)(e)) &&
                void 0 !== n
                ? n
                : null
            }),
            c = u.a.useRef(null),
            i = Object(Bl.a)(),
            s = Object(o.useContext)(Yl).onMessageError
          return n === dn
            ? Object(I.jsx)(d.a, {
                ref: c,
                onClick: function () {
                  s({ anchorElRef: c, message: a })
                },
                size: 'small',
                style: { color: i.palette.error.main, float: 'right' },
                children: Object(I.jsx)(ud.a, {}),
              })
            : n === ln
            ? Object(I.jsx)(id.a, { color: 'success', sx: { float: 'right' } })
            : null
        })
      function Od(e, t) {
        return null != e && null != t
          ? e === t ||
              (e.length === t.length &&
                e.every(function (e, n) {
                  return e.type === t[n].type && e.name === t[n].name
                }))
          : void 0 === e && void 0 === t
      }
      function vd(e) {
        var t = Object(z.c)(Nn)
        return Object(z.c)(function (n) {
          return null != t ? Vn(e)(n) : 'uninitialized'
        })
      }
      var gd = n(1701),
        yd = Object(H.a)({}, Ju, { fileType: Xn, param: {} }),
        wd = Object(Re.d)({
          name: qn,
          initialState: yd,
          reducers: {
            deleteInputNode: function (e, t) {
              delete e[t.payload]
            },
            setCsvInputNodeParam: function (e, t) {
              var n = t.payload,
                r = n.nodeId,
                a = n.param,
                c = e[r]
              er(c) && (c.param = a)
            },
            setInputNodeHDF5Path: function (e, t) {
              var n = t.payload,
                r = n.nodeId,
                a = n.path,
                c = e[r]
              tr(c) && (c.hdf5Path = a)
            },
          },
          extraReducers: function (e) {
            return e
              .addCase(hs, function (e, t) {
                var n = t.payload,
                  r = n.nodeId,
                  a = n.filePath,
                  c = e[r]
                ;(c.selectedFilePath = a), tr(c) && (c.hdf5Path = void 0)
              })
              .addCase(qu, function (e, t) {
                var n,
                  r = t.payload,
                  a = r.node,
                  c = r.fileType
                if (
                  (null === (n = a.data) || void 0 === n ? void 0 : n.type) ===
                  Wt
                )
                  switch (c) {
                    case Yn:
                      e[a.id] = {
                        fileType: c,
                        param: { setHeader: null, setIndex: !1, transpose: !1 },
                      }
                      break
                    case Xn:
                    case $n:
                      e[a.id] = { fileType: c, param: {} }
                      break
                    case Jn:
                    case Qn:
                      e[a.id] = {
                        fileType: Yn,
                        param: { setHeader: null, setIndex: !1, transpose: !1 },
                      }
                  }
              })
              .addCase(As, function (e, t) {
                t.payload
                  .filter(function (e) {
                    return Vt(e)
                  })
                  .forEach(function (t) {
                    var n
                    ;(null === (n = t.data) || void 0 === n
                      ? void 0
                      : n.type) === Wt && delete e[t.id]
                  })
              })
              .addCase(Ws, function (e, t) {
                Object.keys(e).includes(t.payload) && delete e[t.payload]
              })
              .addCase(Br.fulfilled, function (e, t) {
                var n = {}
                return (
                  Object.values(t.payload.nodeDict)
                    .filter(ms)
                    .forEach(function (e) {
                      null != e.data &&
                        (e.data.fileType === Xn
                          ? (n[e.id] = {
                              fileType: Xn,
                              selectedFilePath: e.data.path,
                              param: {},
                            })
                          : e.data.fileType === Yn
                          ? (n[e.id] = {
                              fileType: Yn,
                              selectedFilePath: e.data.path,
                              param: e.data.param,
                            })
                          : e.data.fileType === $n &&
                            (n[e.id] = {
                              fileType: $n,
                              hdf5Path: e.data.hdf5Path,
                              selectedFilePath: e.data.path,
                              param: {},
                            }))
                    }),
                  n
                )
              })
              .addCase(Ps.fulfilled, function (e, t) {
                var n = t.meta.arg.nodeId
                if (null != n) {
                  var r = t.payload.resultPath,
                    a = e[n]
                  a.fileType === Xn
                    ? (a.selectedFilePath = [r])
                    : (a.selectedFilePath = r)
                }
              })
          },
        }),
        Id = wd.actions,
        kd = Id.setCsvInputNodeParam,
        Cd = Id.setInputNodeHDF5Path,
        Sd = wd.reducer,
        _d = u.a.createContext({
          nodeId: '',
          filePath: '',
          dataType: 'csv',
          itemId: NaN,
        }),
        Pd = u.a.memo(function () {
          var e = u.a.useContext(_d).filePath,
            t = Object(z.c)(Bc(e)),
            n = Object(z.c)(Uc(e)),
            r = Object(z.c)(Hc(e)),
            a = Object(z.c)(Vc(e)),
            c = Object(z.b)()
          return (
            u.a.useEffect(
              function () {
                t || c(Pc({ path: e }))
              },
              [c, t, e],
            ),
            n
              ? Object(I.jsx)(Hl.a, {})
              : null != a
              ? Object(I.jsx)(O.a, { color: 'error', children: a })
              : r
              ? Object(I.jsx)(Td, {})
              : null
          )
        }),
        Td = u.a.memo(function () {
          var e = u.a.useContext(_d),
            t = e.itemId,
            n = e.filePath,
            r = Object(z.c)(Hi(t)),
            a = Object(z.c)(Ki(t)),
            c = Object(z.c)(Zi(t))
          return Object(I.jsx)(Ed, {
            path: n,
            transpose: r,
            setHeader: a,
            setIndex: c,
          })
        }),
        Ed = u.a.memo(function (e) {
          var t,
            n = e.path,
            r = e.transpose,
            a = e.setIndex,
            c = e.setHeader,
            i = Object(z.c)(
              ((t = n),
              function (e) {
                return Dc(e).csv[t].data
              }),
              function (e, t) {
                return null != e && null != t
                  ? Ma(e, t)
                  : void 0 === e && void 0 === t
              },
            ),
            o = u.a.useMemo(
              function () {
                return r
                  ? i[0].map(function (e, t) {
                      return i.map(function (e) {
                        return e[t]
                      })
                    })
                  : i
              },
              [i, r],
            ),
            s = u.a.useMemo(
              function () {
                var e = function () {
                  return null === c
                    ? o[0]
                    : c >= o.length
                    ? o[o.length - 1]
                    : o[c]
                }
                return a
                  ? [{ field: 'col0', headerName: 'index', width: 150 }].concat(
                      Object(Yr.a)(
                        e().map(function (e, t) {
                          return {
                            field: 'col'.concat(t + 1),
                            headerName: ''.concat(null === c ? t : e),
                            width: 150,
                          }
                        }),
                      ),
                    )
                  : e().map(function (e, t) {
                      return {
                        field: 'col'.concat(t + 1),
                        headerName: ''.concat(null === c ? t : e),
                        width: 150,
                      }
                    })
              },
              [o, c, a],
            ),
            l = o
              .map(function (e, t) {
                var n = Object.fromEntries(
                  [t].concat(Object(Yr.a)(e)).map(function (e, t) {
                    return ['col'.concat(t), e]
                  }),
                )
                return (n.id = t), n
              })
              .filter(function (e, t) {
                return null === c || (null !== c && t > c)
              })
          return Object(I.jsx)('div', {
            style: { height: 300, width: '100%' },
            children: Object(I.jsx)(yt.a, { rows: l, columns: s }),
          })
        }),
        Fd = ['filePath'],
        Nd = {
          width: 8,
          height: 15,
          top: 15,
          border: '1px solid',
          borderColor: '#555',
          borderRadius: 0,
        },
        Dd = u.a.memo(function (e) {
          return Object(z.c)(rr(e.id))
            ? Object(I.jsx)(Rd, Object(K.a)({}, e))
            : null
        }),
        Rd = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = Object(z.b)(),
            a = Object(z.c)(ar(t)),
            c = Object(Bl.a)()
          return Object(I.jsxs)('div', {
            style: {
              height: '100%',
              width: '230px',
              background: n
                ? Object(Vl.a)(c.palette.primary.light, 0.1)
                : void 0,
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  r(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(Xl, {
                nodeId: t,
                onChangeFilePath: function (e) {
                  Array.isArray(e) ||
                    (function (e) {
                      r(hs({ nodeId: t, filePath: e }))
                    })(e)
                },
                fileType: Yn,
                filePath: null !== a && void 0 !== a ? a : '',
              }),
              !!a && Object(I.jsx)(zd, { nodeId: t, filePath: a }),
              Object(I.jsx)(Et.b, {
                type: 'source',
                position: Et.c.Right,
                id: Jl(t, 'csv', 'CsvData'),
                style: Nd,
              }),
            ],
          })
        }),
        zd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = e.filePath,
            r = u.a.useState(!1),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1],
            o = u.a.useState(
              Object(z.c)(
                (function (e) {
                  return function (t) {
                    return ur(e)(t).setHeader
                  }
                })(t),
              ),
            ),
            s = Object(N.a)(o, 2),
            l = s[0],
            d = s[1],
            f = u.a.useState(
              Object(z.c)(
                (function (e) {
                  return function (t) {
                    return ur(e)(t).setIndex
                  }
                })(t),
              ),
            ),
            j = Object(N.a)(f, 2),
            p = j[0],
            b = j[1],
            h = u.a.useState(
              Object(z.c)(
                (function (e) {
                  return function (t) {
                    return ur(e)(t).transpose
                  }
                })(t),
              ),
            ),
            x = Object(N.a)(h, 2),
            v = x[0],
            g = x[1],
            y = Object(z.b)()
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(G.a, {
                onClick: function () {
                  return i(!0)
                },
                children: 'Settings',
              }),
              Object(I.jsxs)(ha.a, {
                open: c,
                children: [
                  Object(I.jsx)(xa.a, { children: 'Csv Setting' }),
                  Object(I.jsxs)(Ll.a, {
                    dividers: !0,
                    children: [
                      Object(I.jsxs)(m.a, {
                        sx: {
                          display: 'flex',
                          p: 1,
                          m: 1,
                          alignItems: 'flex-start',
                        },
                        children: [
                          Object(I.jsx)(gd.a, {
                            sx: {
                              margin: function (e) {
                                return e.spacing(0, 1, 0, 1)
                              },
                            },
                            control: Object(I.jsx)(sl.a, {
                              checked: v,
                              onChange: function (e) {
                                return g(e.target.checked)
                              },
                            }),
                            label: 'Transpose',
                          }),
                          Object(I.jsx)(ll.a, {
                            label: 'header',
                            sx: {
                              width: 100,
                              margin: function (e) {
                                return e.spacing(0, 1, 0, 1)
                              },
                            },
                            type: 'number',
                            InputLabelProps: { shrink: !0 },
                            onChange: function (e) {
                              var t = Number(e.target.value)
                              t >= 0 && d(t)
                            },
                            value: l,
                          }),
                          Object(I.jsx)(gd.a, {
                            sx: {
                              margin: function (e) {
                                return e.spacing(0, 1, 0, 1)
                              },
                            },
                            control: Object(I.jsx)(sl.a, {
                              checked: p,
                              onChange: function (e) {
                                return b(e.target.checked)
                              },
                            }),
                            label: 'Set Index',
                          }),
                        ],
                      }),
                      Object(I.jsx)(O.a, {
                        variant: 'h6',
                        children: 'Preview',
                      }),
                      Object(I.jsx)(Ld, {
                        filePath: n,
                        transpose: v,
                        setHeader: l,
                        setIndex: p,
                      }),
                    ],
                  }),
                  Object(I.jsxs)(ma.a, {
                    children: [
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          i(!1)
                        },
                        variant: 'outlined',
                        color: 'inherit',
                        children: 'cancel',
                      }),
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          i(!1),
                            y(
                              kd({
                                nodeId: t,
                                param: {
                                  setHeader: l,
                                  setIndex: p,
                                  transpose: v,
                                },
                              }),
                            )
                        },
                        color: 'primary',
                        variant: 'outlined',
                        children: 'OK',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }),
        Ld = u.a.memo(function (e) {
          var t = e.filePath,
            n = Object($.a)(e, Fd),
            r = Object(z.c)(Bc(t)),
            a = Object(z.c)(Uc(t)),
            c = Object(z.c)(Hc(t)),
            i = Object(z.c)(Vc(t)),
            o = Object(z.b)()
          return (
            u.a.useEffect(
              function () {
                r || o(Pc({ path: t }))
              },
              [o, r, t],
            ),
            a
              ? Object(I.jsx)(Hl.a, {})
              : null != i
              ? Object(I.jsx)(O.a, { color: 'error', children: i })
              : c
              ? Object(I.jsx)(Ed, Object(K.a)({ path: t }, n))
              : null
          )
        }),
        Md = n(405),
        Ad = n.n(Md),
        Wd = n(406),
        Bd = n.n(Wd),
        Vd = function (e) {
          return null != e.hdf5 ? e.hdf5 : void 0
        }
      function Ud(e) {
        return Hd.apply(this, arguments)
      }
      function Hd() {
        return (Hd = Object(F.a)(
          R.a.mark(function e(t) {
            var n
            return R.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2), Te.get(''.concat(_e, '/hdf5/').concat(t))
                    )
                  case 2:
                    return (n = e.sent), e.abrupt('return', n.data)
                  case 4:
                  case 'end':
                    return e.stop()
                }
            }, e)
          }),
        )).apply(this, arguments)
      }
      var Kd = 'hdf5',
        Zd = Object(Re.c)(
          ''.concat(Kd, '/getHDF5Tree'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (r = t.path), (e.prev = 1), (e.next = 4), Ud(r)
                        case 4:
                          return (a = e.sent), e.abrupt('return', a)
                        case 8:
                          return (
                            (e.prev = 8),
                            (e.t0 = e.catch(1)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 11:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[1, 8]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Gd = {
          width: 8,
          height: 15,
          top: 15,
          border: '1px solid',
          borderColor: '#555',
          borderRadius: 0,
        },
        qd = u.a.memo(function (e) {
          return Object(z.c)(rr(e.id))
            ? Object(I.jsx)(Yd, Object(K.a)({}, e))
            : null
        }),
        Yd = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = Object(z.b)(),
            a = Object(z.c)(ir(t)),
            c = Object(Bl.a)()
          return Object(I.jsxs)('div', {
            style: {
              height: '100%',
              width: '230px',
              background: n
                ? Object(Vl.a)(c.palette.primary.light, 0.1)
                : void 0,
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  r(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(Xl, {
                nodeId: t,
                onChangeFilePath: function (e) {
                  Array.isArray(e) ||
                    (function (e) {
                      r(hs({ nodeId: t, filePath: e }))
                    })(e)
                },
                fileType: $n,
                filePath: null !== a && void 0 !== a ? a : '',
              }),
              void 0 !== a && Object(I.jsx)(Xd, { nodeId: t }),
              Object(I.jsx)(Et.b, {
                type: 'source',
                position: Et.c.Right,
                id: Jl(t, 'hdf5', 'HDF5Data'),
                style: Gd,
              }),
            ],
          })
        }),
        Xd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = u.a.useState(!1),
            r = Object(N.a)(n, 2),
            a = r[0],
            c = r[1],
            i = Object(z.c)(sr(t))
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(G.a, {
                variant: 'outlined',
                size: 'small',
                onClick: function () {
                  return c(!0)
                },
                children: 'Structure',
              }),
              Object(I.jsx)(O.a, {
                className: 'selectFilePath',
                variant: 'caption',
                children: i || 'No structure is selected.',
              }),
              Object(I.jsxs)(ha.a, {
                open: a,
                onClose: function () {
                  return c(!1)
                },
                fullWidth: !0,
                children: [
                  Object(I.jsx)(xa.a, { children: 'Select File' }),
                  Object(I.jsx)($d, { nodeId: t }),
                  Object(I.jsxs)(ma.a, {
                    children: [
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          return c(!1)
                        },
                        color: 'inherit',
                        variant: 'outlined',
                        children: 'cancel',
                      }),
                      Object(I.jsx)(G.a, {
                        onClick: function () {
                          return c(!1)
                        },
                        color: 'primary',
                        variant: 'outlined',
                        autoFocus: !0,
                        children: 'OK',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }),
        $d = u.a.memo(function (e) {
          var t = e.nodeId,
            n = Object(Bl.a)()
          return Object(I.jsx)(Ll.a, {
            dividers: !0,
            children: Object(I.jsx)('div', {
              style: {
                height: 300,
                overflow: 'auto',
                marginBottom: n.spacing(1),
                border: '1px solid',
                padding: n.spacing(1),
                borderColor: n.palette.divider,
              },
              children: Object(I.jsx)(Jd, { nodeId: t }),
            }),
          })
        }),
        Jd = u.a.memo(function (e) {
          var t = e.nodeId,
            n = (function (e) {
              var t = Object(z.b)(),
                n = Object(z.c)(function (e) {
                  var t
                  return null === (t = Vd(e)) || void 0 === t ? void 0 : t.tree
                }),
                r = Object(z.c)(function (e) {
                  var t, n
                  return (
                    null !==
                      (t =
                        null === (n = Vd(e)) || void 0 === n
                          ? void 0
                          : n.isLoading) &&
                    void 0 !== t &&
                    t
                  )
                }),
                a = Object(z.c)(ir(e))
              return (
                u.a.useEffect(
                  function () {
                    !r && a && t(Zd({ path: a }))
                  },
                  [r, a, t],
                ),
                [n, r]
              )
            })(t),
            r = Object(N.a)(n, 2),
            a = r[0],
            c = r[1]
          return Object(I.jsxs)('div', {
            children: [
              c && Object(I.jsx)(Hl.a, {}),
              Object(I.jsx)(ku.a, {
                children:
                  null === a || void 0 === a
                    ? void 0
                    : a.map(function (e) {
                        return Object(I.jsx)(Qd, { node: e, nodeId: t })
                      }),
              }),
            ],
          })
        }),
        Qd = u.a.memo(function (e) {
          var t = e.node,
            n = e.nodeId,
            r = Object(z.b)()
          return t.isDir
            ? Object(I.jsx)(Cu.a, {
                icon: Object(I.jsx)(Ad.a, { htmlColor: 'skyblue' }),
                nodeId: t.path,
                label: t.name,
                children: t.nodes.map(function (e, t) {
                  return Object(I.jsx)(Qd, { node: e, nodeId: n }, t)
                }),
              })
            : Object(I.jsx)(Cu.a, {
                icon: Object(I.jsx)(Bd.a, { fontSize: 'small' }),
                nodeId: t.path,
                label:
                  t.name +
                  '   (shape='
                    .concat(t.shape, ', nbytes=')
                    .concat(t.nbytes, ')'),
                onClick: function () {
                  return (e = t.path), void r(Cd({ nodeId: n, path: e }))
                  var e
                },
              })
        })
      var ef = {
          width: 8,
          height: 15,
          top: 15,
          border: '1px solid',
          borderColor: '#555',
          borderRadius: 0,
        },
        tf = u.a.memo(function (e) {
          return Object(z.c)(rr(e.id))
            ? Object(I.jsx)(nf, Object(K.a)({}, e))
            : null
        }),
        nf = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = Object(z.b)(),
            a = Object(z.c)(ar(t)),
            c = Object(Bl.a)(),
            i = 'FluoData',
            o = Ul(i)
          return Object(I.jsxs)('div', {
            style: {
              height: '100%',
              width: '230px',
              background: n
                ? Object(Vl.a)(c.palette.primary.light, 0.1)
                : void 0,
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  r(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(Xl, {
                nodeId: t,
                onChangeFilePath: function (e) {
                  Array.isArray(e) ||
                    (function (e) {
                      r(hs({ nodeId: t, filePath: e }))
                    })(e)
                },
                fileType: Yn,
                filePath: null !== a && void 0 !== a ? a : '',
              }),
              !!a && Object(I.jsx)(zd, { nodeId: t, filePath: a }),
              Object(I.jsx)(Et.b, {
                type: 'source',
                position: Et.c.Right,
                id: Jl(t, 'fluo', i),
                style: Object(K.a)(Object(K.a)({}, ef), {}, { background: o }),
              }),
            ],
          })
        }),
        rf = {
          width: 8,
          height: 15,
          top: 15,
          border: '1px solid',
          borderColor: '#555',
          borderRadius: 0,
        },
        af = u.a.memo(function (e) {
          return Object(z.c)(rr(e.id))
            ? Object(I.jsx)(cf, Object(K.a)({}, e))
            : null
        }),
        cf = u.a.memo(function (e) {
          var t = e.id,
            n = e.selected,
            r = Object(z.b)(),
            a = Object(z.c)(ar(t)),
            c = Object(Bl.a)(),
            i = 'BehaviorData',
            o = Ul(i)
          return Object(I.jsxs)('div', {
            style: {
              height: '100%',
              width: '230px',
              background: n
                ? Object(Vl.a)(c.palette.primary.light, 0.1)
                : void 0,
            },
            children: [
              Object(I.jsx)('button', {
                className: 'flowbutton',
                onClick: function () {
                  r(Ws(t))
                },
                style: {
                  color: 'black',
                  position: 'absolute',
                  top: -10,
                  right: 10,
                },
                children: '\xd7',
              }),
              Object(I.jsx)(Xl, {
                nodeId: t,
                onChangeFilePath: function (e) {
                  Array.isArray(e) ||
                    (function (e) {
                      r(hs({ nodeId: t, filePath: e }))
                    })(e)
                },
                fileType: Yn,
                filePath: null !== a && void 0 !== a ? a : '',
              }),
              !!a && Object(I.jsx)(zd, { nodeId: t, filePath: a }),
              Object(I.jsx)(Et.b, {
                type: 'source',
                position: Et.c.Right,
                id: Jl(t, 'behavior', i),
                style: Object(K.a)(Object(K.a)({}, rf), {}, { background: o }),
              }),
            ],
          })
        }),
        of =
          (n(946),
          {
            ImageFileNode: nd,
            CsvFileNode: Dd,
            HDF5FileNode: qd,
            AlgorithmNode: dd,
            FluoFileNode: tf,
            BehaviorFileNode: af,
          }),
        uf = {
          buttonedge: function (e) {
            var t = e.id,
              n = e.sourceX,
              r = e.sourceY,
              a = e.targetX,
              c = e.targetY,
              i = e.sourcePosition,
              o = e.targetPosition,
              u = e.style,
              s = void 0 === u ? {} : u,
              l = (e.data, e.arrowHeadType),
              d = e.markerEndId,
              f = Object(Et.g)({
                sourceX: n,
                sourceY: r,
                sourcePosition: i,
                targetX: a,
                targetY: c,
                targetPosition: o,
              }),
              j = Object(Et.i)(l, d),
              p = Object(Et.h)({
                sourceX: n,
                sourceY: r,
                targetX: a,
                targetY: c,
              }),
              b = Object(N.a)(p, 2),
              h = b[0],
              m = b[1],
              x = Object(z.b)()
            return Object(I.jsxs)(I.Fragment, {
              children: [
                Object(I.jsx)('path', {
                  id: t,
                  style: s,
                  className: 'react-flow__edge-path',
                  d: f,
                  markerEnd: j,
                }),
                Object(I.jsx)('foreignObject', {
                  width: 40,
                  height: 40,
                  x: h - 20,
                  y: m - 20,
                  className: 'edgebutton-foreignobject',
                  children: Object(I.jsx)('button', {
                    className: 'flowbutton',
                    onClick: function () {
                      x(Ws(t))
                    },
                    children: '\xd7',
                  }),
                }),
              ],
            })
          },
        },
        sf = n(1771),
        lf = n(320),
        df = n(1799),
        ff = n(133),
        jf = n.n(ff),
        pf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.b)(),
            r = Object(z.c)(
              ((e = t),
              function (t) {
                return Lc(e)(t) && Dc(t).heatMap[e].pending
              }),
            ),
            a = Object(z.c)(Lc(t)),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Lc(e)(t) ? Dc(t).heatMap[e].error : null
                }
              })(t),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Lc(e)(t) && Dc(t).heatMap[e].fulfilled
                }
              })(t),
            )
          return (
            u.a.useEffect(
              function () {
                a || n(Sc({ path: t }))
              },
              [n, a, t],
            ),
            r
              ? Object(I.jsx)(Hl.a, {})
              : null != c
              ? Object(I.jsx)(O.a, { color: 'error', children: c })
              : i
              ? Object(I.jsx)(bf, {})
              : null
          )
        }),
        bf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.filePath,
            r = t.itemId,
            a = Object(z.c)(
              ((e = n),
              function (t) {
                return Dc(t).heatMap[e].data
              }),
              hf,
            ),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Dc(t).heatMap[e].columns
                }
              })(n),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Dc(t).heatMap[e].index
                }
              })(n),
            ),
            o = Object(z.c)(Vi(r)),
            s = Object(z.c)(Ui(r)),
            l = Object(z.c)(di(r)),
            d = Object(z.c)(fi(r)),
            f = u.a.useMemo(
              function () {
                return null != a
                  ? [
                      {
                        z: a,
                        x: c,
                        y: i,
                        type: 'heatmap',
                        name: 'heatmap',
                        colorscale: s.map(function (e) {
                          var t = parseFloat(e.offset),
                            n = s.map(function (e) {
                              return parseFloat(e.offset)
                            })
                          return (
                            t === Math.max.apply(Math, Object(Yr.a)(n)) &&
                              (t = 1),
                            t === Math.min.apply(Math, Object(Yr.a)(n)) &&
                              (t = 0),
                            [t, e.rgb]
                          )
                        }),
                        hoverongaps: !1,
                        showlegend: !0,
                        showscale: o,
                      },
                    ]
                  : []
              },
              [a, o, s, c, i],
            ),
            j = u.a.useMemo(
              function () {
                return {
                  width: l,
                  height: d - 50,
                  dragmode: 'pan',
                  margin: { t: 60, l: 50, b: 30 },
                  autosize: !0,
                }
              },
              [l, d],
            ),
            p = Object(z.c)(hi(r)),
            b = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: { format: Object(z.c)(mi(r)), filename: p },
            }
          return Object(I.jsx)(jf.a, { data: f, layout: j, config: b })
        })
      function hf(e, t) {
        return null != e && null != t ? Ma(e, t) : void 0 === e && void 0 === t
      }
      var mf,
        xf = n(259),
        Of = n.n(xf),
        vf = n(1770),
        gf = {
          width: 30,
          height: 30,
          left: Math.floor(145.5),
          top: Math.floor(145.5),
        }
      !(function (e) {
        ;(e.LEFT = 'LEFT'),
          (e.RIGHT = 'RIGHT'),
          (e.BOTTOM = 'BOTTOM'),
          (e.TOP = 'TOP')
      })(mf || (mf = {}))
      var yf = 320,
        wf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.filePath,
            r = t.itemId,
            a = Object(z.c)(wi(r)),
            c = Object(z.c)(Ii(r)),
            i = Object(z.c)(Wc(n)),
            o = Object(z.c)(Ac(n)),
            s = Object(z.c)(
              ((e = n),
              function (t) {
                return Ac(e)(t) && Dc(t).image[e].fulfilled
              }),
            ),
            l = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Ac(e)(t) ? Dc(t).image[e].error : null
                }
              })(n),
            ),
            d = Object(z.c)(vi(r)),
            f = Object(z.b)()
          return (
            u.a.useEffect(
              function () {
                o ||
                  f(
                    _c({
                      path: n,
                      startIndex: null !== a && void 0 !== a ? a : 1,
                      endIndex: null !== c && void 0 !== c ? c : 10,
                    }),
                  ),
                  null != d && f(Tc({ path: d }))
              },
              [f, o, n, a, c, d],
            ),
            i
              ? Object(I.jsx)(Hl.a, {})
              : null != l
              ? Object(I.jsx)(O.a, { color: 'error', children: l })
              : s
              ? Object(I.jsx)(If, {})
              : null
          )
        }),
        If = u.a.memo(function () {
          var e = u.a.useContext(_d).itemId,
            t = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = si(e)(t)
                  if (ei(n)) return n.activeIndex
                  throw new Error('invalid VisualaizeItemType')
                }
              })(e),
            )
          return Object(I.jsx)(kf, { activeIndex: t })
        }),
        kf = u.a.memo(function (e) {
          var t = e.activeIndex,
            n = Object(z.b)(),
            r = u.a.useContext(_d),
            a = r.filePath,
            c = r.itemId,
            i = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  return Mc(e)(n).data[t]
                }
              })(a, t),
              Sf,
            ),
            s = Object(z.c)(vi(c)),
            l = Object(z.c)(function (e) {
              return null != s ? Kc(s)(e) : []
            }, Sf),
            d = Object(o.useState)(!1),
            f = Object(N.a)(d, 2),
            j = f[0],
            p = f[1],
            b = Object(o.useState)(!1),
            h = Object(N.a)(b, 2),
            x = h[0],
            O = h[1],
            v = Object(o.useState)(l),
            g = Object(N.a)(v, 2),
            y = g[0],
            w = g[1],
            k = Object(o.useState)([]),
            C = Object(N.a)(k, 2),
            S = C[0],
            _ = C[1],
            P = Object(z.c)(ui),
            T = Object(z.c)(gi(c)),
            E = Object(z.c)(ki(c)),
            D = Object(z.c)(yi(c)),
            L = Object(z.c)(Ci(c)),
            M = Object(z.c)(Si(c)),
            A = Object(z.c)(_i(c)),
            W = Object(z.c)(Pi(c)),
            B = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  var r = si(e)(n)
                  if (ti(r)) {
                    var a = r.maxIndex
                    if (0 !== a) return a
                  }
                  return null !== t ? Bi(t)(n) : 0
                }
              })(c, s),
            ),
            V = Object(z.c)(Ti(c)),
            U = Object(z.c)(di(c)),
            H = Object(z.c)(fi(c)),
            Z = Object(o.useState)(gf),
            G = Object(N.a)(Z, 2),
            q = G[0],
            Y = G[1],
            X = Object(o.useState)(!1),
            $ = Object(N.a)(X, 2),
            J = $[0],
            Q = $[1],
            ee = Object(o.useState)(),
            te = Object(N.a)(ee, 2),
            ne = te[0],
            re = te[1],
            ae = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n,
                    r,
                    a = si(e)(t)
                  if (ei(a))
                    return null !==
                      (n =
                        null === (r = a.roiItem) || void 0 === r
                          ? void 0
                          : r.outputKey) && void 0 !== n
                      ? n
                      : null
                  throw new Error('invalid VisualaizeItemType')
                }
              })(c),
            ),
            ce = Object(o.useRef)(0),
            ie = Object(o.useRef)(0),
            oe = Of()({
              colormap: 'jet',
              nshades: 100,
              format: 'rgba',
              alpha: 1,
            })
          Object(o.useEffect)(
            function () {
              w(l)
            },
            [l],
          ),
            Object(o.useEffect)(
              function () {
                xe(), ve()
              },
              [ae, s],
            )
          var ue = u.a.useMemo(
              function () {
                return [
                  {
                    z: i,
                    type: 'heatmap',
                    name: 'images',
                    colorscale: A.map(function (e) {
                      var t = parseFloat(e.offset),
                        n = A.map(function (e) {
                          return parseFloat(e.offset)
                        })
                      return (
                        t === Math.max.apply(Math, Object(Yr.a)(n)) && (t = 1),
                        t === Math.min.apply(Math, Object(Yr.a)(n)) && (t = 0),
                        [
                          t,
                          _f(
                            e.rgb
                              .replace(/[^0-9,]/g, '')
                              .split(',')
                              .map(function (e) {
                                return Number(e)
                              }),
                            W,
                          ),
                        ]
                      )
                    }),
                    hoverongaps: !1,
                    showscale: M,
                    zsmooth: D,
                  },
                  {
                    z: y,
                    type: 'heatmap',
                    name: 'roi',
                    hovertemplate: j ? 'none' : 'cell id: %{z}',
                    colorscale: Object(Yr.a)(Array(B)).map(function (e, t) {
                      var n = Math.floor(((t % 10) * 10 + t / 10) % 100)
                      return [t / (B - 1), _f(oe[n], V)]
                    }),
                    zmin: 0,
                    zmax: B,
                    hoverongaps: !1,
                    zsmooth: !1,
                    showscale: !1,
                  },
                ]
              },
              [i, y, D, M, A, oe, B, V, W, j],
            ),
            se = u.a.useState(!1),
            le = Object(N.a)(se, 2),
            de = le[0],
            fe = le[1],
            je = (function (e) {
              var t,
                n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : 500
              return function () {
                for (
                  var r = arguments.length, a = new Array(r), c = 0;
                  c < r;
                  c++
                )
                  a[c] = arguments[c]
                clearTimeout(t),
                  (t = setTimeout(function () {
                    return e.apply(void 0, a)
                  }, n))
              }
            })(function (e) {
              null != e.range && n(Ji({ itemId: c, range: e.range }))
            }),
            pe = u.a.useMemo(
              function () {
                return {
                  width: U,
                  height: H - 130,
                  margin: { t: 30, l: 100, b: 20 },
                  dragmode: de ? 'select' : 'pan',
                  xaxis: {
                    autorange: !0,
                    showgrid: L,
                    showline: E,
                    zeroline: !1,
                    autotick: !0,
                    ticks: '',
                    showticklabels: T,
                  },
                  yaxis: {
                    automargin: !0,
                    autorange: 'reversed',
                    showgrid: L,
                    showline: E,
                    zeroline: !1,
                    autotick: !0,
                    ticks: '',
                    showticklabels: T,
                  },
                }
              },
              [L, E, T, U, H, de, j],
            ),
            be = Object(z.c)(hi(c)),
            he = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: {
                format: Object(z.c)(mi(c)),
                filename: be,
              },
            },
            me = function (e) {
              if (e.z) {
                var t = [].concat(Object(Yr.a)(S), [e]),
                  n = y.map(function (e) {
                    return e.map(function (e) {
                      return t.some(function (t) {
                        return t.z === e
                      })
                        ? 0
                        : e
                    })
                  })
                _([].concat(Object(Yr.a)(S), [e])), w(n)
              }
            },
            xe = function () {
              _([]), w(l)
            },
            Oe = function () {
              p(!0)
            },
            ve = function () {
              p(!1), Y(gf), re(void 0)
            },
            ge = function () {
              Q(!1), re(void 0)
            },
            ye = function (e, t) {
              re(e), (ce.current = t.pageX), (ie.current = t.pageY)
            },
            we = (function () {
              var e = Object(F.a)(
                R.a.mark(function e() {
                  var t, r, a, c, i, o, u
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (s && !x) {
                              e.next = 2
                              break
                            }
                            return e.abrupt('return')
                          case 2:
                            return (
                              O(!0),
                              (t = y[0].length - 1),
                              (r = y.length - 1),
                              (a = Number(
                                ((q.width + 2) / (yf / t)).toFixed(1),
                              )),
                              (c = Number(
                                ((q.height + 2) / (yf / r)).toFixed(1),
                              )),
                              (i = Number((q.left / (yf / t)).toFixed(1))),
                              (o = Number((q.top / (yf / r)).toFixed(1))),
                              (u = {
                                posx: i + Math.floor(a / 2),
                                posy: o + Math.floor(c / 2),
                                sizex: a,
                                sizey: c,
                              }),
                              n(uu()),
                              (e.prev = 11),
                              (e.next = 14),
                              xc(s, u)
                            )
                          case 14:
                            e.next = 18
                            break
                          case 16:
                            ;(e.prev = 16), (e.t0 = e.catch(11))
                          case 18:
                            O(!1), ve(), n(Tc({ path: s })), Ce()
                          case 22:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[11, 16]],
                  )
                }),
              )
              return function () {
                return e.apply(this, arguments)
              }
            })(),
            Ie = (function () {
              var e = Object(F.a)(
                R.a.mark(function e() {
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (s && !x) {
                              e.next = 2
                              break
                            }
                            return e.abrupt('return')
                          case 2:
                            return (
                              O(!0),
                              n(uu()),
                              (e.prev = 4),
                              (e.next = 7),
                              vc(s, {
                                ids: S.map(function (e) {
                                  return e.z - 1
                                }),
                              })
                            )
                          case 7:
                            e.next = 11
                            break
                          case 9:
                            ;(e.prev = 9), (e.t0 = e.catch(4))
                          case 11:
                            O(!1), xe(), n(Tc({ path: s })), Ce()
                          case 15:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[4, 9]],
                  )
                }),
              )
              return function () {
                return e.apply(this, arguments)
              }
            })(),
            ke = (function () {
              var e = Object(F.a)(
                R.a.mark(function e() {
                  return R.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (s && !x) {
                              e.next = 2
                              break
                            }
                            return e.abrupt('return')
                          case 2:
                            return (
                              O(!0),
                              n(uu()),
                              (e.prev = 4),
                              (e.next = 7),
                              yc(s, {
                                ids: S.map(function (e) {
                                  return e.z - 1
                                }),
                              })
                            )
                          case 7:
                            e.next = 11
                            break
                          case 9:
                            ;(e.prev = 9), (e.t0 = e.catch(4))
                          case 11:
                            O(!1), xe(), n(Tc({ path: s })), Ce()
                          case 15:
                          case 'end':
                            return e.stop()
                        }
                    },
                    e,
                    null,
                    [[4, 9]],
                  )
                }),
              )
              return function () {
                return e.apply(this, arguments)
              }
            })(),
            Ce = function () {
              P &&
                Object.keys(P).forEach(function (e) {
                  ti(P[e]) && n(Ic({ path: P[e].filePath, itemId: Number(e) }))
                })
            }
          return Object(I.jsxs)('div', {
            children: [
              Object(I.jsxs)(m.a, {
                sx: { display: 'flex' },
                children: [
                  Object(I.jsx)(m.a, {
                    sx: { flexGrow: 1, mt: 1 },
                    children: Object(I.jsx)(Cf, { activeIndex: t }),
                  }),
                  Object(I.jsx)(gd.a, {
                    sx: { ml: 1 },
                    control: Object(I.jsx)(sl.a, {
                      checked: de,
                      onChange: function (e) {
                        fe(e.target.checked)
                      },
                    }),
                    label: 'drag select',
                  }),
                ],
              }),
              Object(I.jsx)(m.a, {
                sx: { minHeight: 5.5 },
                children: S.length
                  ? Object(I.jsxs)(I.Fragment, {
                      children: [
                        Object(I.jsx)(Pf, {
                          children: Object(I.jsxs)('span', {
                            children: [
                              'ROI Selecteds: [',
                              String(
                                S.map(function (e) {
                                  return e.z
                                }),
                              ),
                              ']',
                            ],
                          }),
                        }),
                        Object(I.jsxs)(Pf, {
                          children: [
                            S.length >= 2
                              ? Object(I.jsx)(Tf, {
                                  sx: { ml: 0, opacity: x ? 0.5 : 1 },
                                  onClick: Ie,
                                  children: 'Merge ROI',
                                })
                              : null,
                            Object(I.jsx)(Tf, {
                              sx: { color: '#F84E1B', opacity: x ? 0.5 : 1 },
                              onClick: ke,
                              children: 'Delete ROI',
                            }),
                            Object(I.jsx)(Tf, {
                              sx: { opacity: x ? 0.5 : 1 },
                              onClick: xe,
                              children: 'Cancel',
                            }),
                          ],
                        }),
                      ],
                    })
                  : null !== y && void 0 !== y && y.length && 'cell_roi' === ae
                  ? j
                    ? Object(I.jsxs)(Pf, {
                        children: [
                          Object(I.jsx)(Tf, {
                            style: {
                              opacity: x ? 0.5 : 1,
                              cursor: x ? 'progress' : 'pointer',
                            },
                            onClick: we,
                            children: 'OK',
                          }),
                          Object(I.jsx)(Tf, {
                            style: {
                              opacity: x ? 0.5 : 1,
                              cursor: x ? 'progress' : 'pointer',
                            },
                            onClick: ve,
                            children: 'Cancel',
                          }),
                        ],
                      })
                    : Object(I.jsx)(Tf, { onClick: Oe, children: 'Add ROI' })
                  : null,
              }),
              Object(I.jsxs)('div', {
                style: { position: 'relative' },
                children: [
                  Object(I.jsx)(jf.a, {
                    data: ue,
                    layout: pe,
                    config: he,
                    onClick: function (e) {
                      var t = e.points[0]
                      t.curveNumber >= 1 &&
                        'cell_roi' === ae &&
                        me({ x: Number(t.x), y: Number(t.y), z: Number(t.z) }),
                        t.curveNumber >= 1 &&
                          t.z > 0 &&
                          n($i({ itemId: c, clickedDataId: t.z.toString() }))
                    },
                    onSelecting: je,
                  }),
                  j
                    ? Object(I.jsx)(Ef, {
                        children: Object(I.jsx)(Ff, {
                          onMouseLeave: ge,
                          onMouseMove: function (e) {
                            var t,
                              n = e.pageX,
                              r = e.pageY
                            if (J) {
                              var a = e.currentTarget.getBoundingClientRect().y,
                                c = q.left + (n - ce.current),
                                i = Math.ceil(r - a - 15) - window.scrollY
                              c < 0
                                ? (c = 0)
                                : c + q.width > yf && (c = yf - q.width),
                                i < 0
                                  ? (i = 0)
                                  : i + q.height > yf && (i = yf - q.height),
                                (t = Object(K.a)(
                                  Object(K.a)({}, q),
                                  {},
                                  { left: c, top: i },
                                ))
                            } else if (ne === mf.LEFT) {
                              var o = q.width - (n - ce.current),
                                u = q.left + (n - ce.current)
                              if (o < 10 || u < 1) return
                              t = Object(K.a)(
                                Object(K.a)({}, q),
                                {},
                                { width: o, left: u },
                              )
                            } else if (ne === mf.RIGHT) {
                              var s = q.width + (n - ce.current)
                              if (s < 10 || s > yf - q.left) return
                              t = Object(K.a)(
                                Object(K.a)({}, q),
                                {},
                                { width: s },
                              )
                            } else if (ne === mf.BOTTOM) {
                              var l = q.height + (r - ie.current)
                              if (l < 10 || l > yf - q.top) return
                              t = Object(K.a)(
                                Object(K.a)({}, q),
                                {},
                                { height: l },
                              )
                            } else if (ne === mf.TOP) {
                              var d = q.height - (r - ie.current),
                                f = q.top + (r - ie.current)
                              if (d < 10 || f < 1) return
                              t = Object(K.a)(
                                Object(K.a)({}, q),
                                {},
                                { height: d, top: f },
                              )
                            }
                            t && Y(Object(K.a)(Object(K.a)({}, q), t)),
                              (ce.current = n),
                              (ie.current = r)
                          },
                          onMouseUp: ge,
                          children: Object(I.jsxs)(Nf, {
                            style: q,
                            children: [
                              Object(I.jsx)(Df, {
                                onMouseDown: function () {
                                  Q(!0)
                                },
                                style: {
                                  width: q.width - 1,
                                  height: q.height - 1,
                                  cursor: J ? 'grabbing' : 'grab',
                                },
                              }),
                              Object(I.jsx)(zf, {
                                onMouseDown: function (e) {
                                  return ye(mf.LEFT, e)
                                },
                              }),
                              Object(I.jsx)(Lf, {
                                onMouseDown: function (e) {
                                  ye(mf.RIGHT, e)
                                },
                              }),
                              Object(I.jsx)(Mf, {
                                onMouseDown: function (e) {
                                  ye(mf.TOP, e)
                                },
                              }),
                              Object(I.jsx)(Af, {
                                onMouseDown: function (e) {
                                  ye(mf.BOTTOM, e)
                                },
                              }),
                            ],
                          }),
                        }),
                      })
                    : null,
                ],
              }),
            ],
          })
        }),
        Cf = u.a.memo(function (e) {
          var t,
            n = e.activeIndex,
            r = Object(z.b)(),
            a = u.a.useContext(_d),
            c = a.filePath,
            i = a.itemId,
            s = Object(z.c)(
              ((t = c),
              function (e) {
                return Wc(t)(e) ? 0 : Mc(t)(e).data.length - 1
              }),
            ),
            l = Object(z.c)(wi(i)),
            d = Object(z.c)(Ii(i)),
            f = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = si(e)(t)
                  if (ei(n)) return n.duration
                  throw new Error('invalid VisualaizeItemType')
                }
              })(i),
            ),
            j = u.a.useRef(null)
          Object(o.useEffect)(
            function () {
              null !== j.current &&
                n >= s &&
                (clearInterval(j.current), (j.current = null))
            },
            [n, s],
          )
          var p = Object(o.useCallback)(
              function () {
                n >= s && r(Fo({ itemId: i, activeIndex: 0 })),
                  s > 1 &&
                    null === j.current &&
                    (j.current = setInterval(function () {
                      r(Eo({ itemId: i }))
                    }, f))
              },
              [n, s, r, f, i],
            ),
            b = Object(o.useCallback)(
              function (e) {
                var t = '' === e.target.value ? '' : Number(e.target.value)
                'number' === typeof t && r(Uo({ itemId: i, duration: t }))
              },
              [r, i],
            )
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(G.a, {
                sx: { mt: 1.5 },
                variant: 'outlined',
                onClick: p,
                children: 'Play',
              }),
              Object(I.jsx)(G.a, {
                sx: { mt: 1.5, ml: 1 },
                variant: 'outlined',
                onClick: function () {
                  null !== j.current &&
                    (clearInterval(j.current), (j.current = null))
                },
                children: 'Pause',
              }),
              Object(I.jsx)(ll.a, {
                sx: { width: 100, ml: 2 },
                label: 'Duration [msec]',
                type: 'number',
                inputProps: { step: 100, min: 0, max: 1e3 },
                InputLabelProps: { shrink: !0 },
                onChange: b,
                value: f,
              }),
              Object(I.jsx)(vf.a, {
                'aria-label': 'Custom marks',
                defaultValue: 20,
                value: l + n,
                valueLabelDisplay: 'auto',
                step: 1,
                marks: !0,
                min: l,
                max: 0 === s ? 0 : d,
                onChange: function (e, t, a) {
                  if ('number' === typeof t) {
                    var c = t - l
                    c >= 0 && c !== n && r(Fo({ itemId: i, activeIndex: c }))
                  }
                },
              }),
            ],
          })
        })
      function Sf(e, t) {
        return null != e && null != t ? Ma(e, t) : void 0 === e && void 0 === t
      }
      function _f(e, t) {
        var n = e[0],
          r = e[1],
          a = e[2],
          c = t,
          i = [
            n.toString(16),
            r.toString(16),
            a.toString(16),
            Math.round(255 * c)
              .toString(16)
              .substring(0, 2),
          ]
        return (
          i.forEach(function (e, t) {
            1 === e.length && (i[t] = '0' + e)
          }),
          '#'.concat(i.join(''))
        )
      }
      var Pf = Object(x.a)('div')({
          mt: 1,
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }),
        Tf = Object(x.a)('div')({
          marginLeft: 16,
          textDecoration: 'underline',
          cursor: 'pointer',
          color: '#1155cc',
          zIndex: 999,
          position: 'relative',
        }),
        Ef = Object(x.a)('div')({
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: 100,
        }),
        Ff = Object(x.a)('div')({
          width: 321,
          height: 321,
          marginTop: 30,
          marginLeft: 99,
          position: 'relative',
        }),
        Nf = Object(x.a)('div')({
          border: '1px solid #ffffff',
          position: 'absolute',
          borderRadius: 100,
        }),
        Df = Object(x.a)('div')({ borderRadius: 100, cursor: 'grab' }),
        Rf = Object(x.a)('div')({
          width: 3,
          height: 3,
          borderRadius: 100,
          position: 'absolute',
          background: '#fff',
        }),
        zf = Object(x.a)(Rf)({
          top: 'calc(50% - 1px)',
          left: -2,
          cursor: 'ew-resize',
        }),
        Lf = Object(x.a)(Rf)({
          top: 'calc(50% - 1px)',
          right: -2,
          cursor: 'ew-resize',
        }),
        Mf = Object(x.a)(Rf)({
          top: -2,
          right: 'calc(50% - 1px)',
          cursor: 'ns-resize',
        }),
        Af = Object(x.a)(Rf)({
          bottom: -2,
          right: 'calc(50% - 1px)',
          cursor: 'ns-resize',
        }),
        Wf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.c)(
              ((e = t),
              function (t) {
                return Zc(e)(t) && Dc(t).roi[e].pending
              }),
            ),
            r = Object(z.c)(Zc(t)),
            a = Object(z.c)(Gc(t)),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Zc(e)(t) ? Dc(t).roi[e].error : null
                }
              })(t),
            ),
            i = Object(z.b)()
          return (
            u.a.useEffect(
              function () {
                r || i(Tc({ path: t }))
              },
              [i, r, t],
            ),
            n
              ? Object(I.jsx)(Hl.a, {})
              : null != c
              ? Object(I.jsx)(O.a, { color: 'error', children: c })
              : a
              ? Object(I.jsx)(Bf, {})
              : null
          )
        }),
        Bf = u.a.memo(function () {
          var e = u.a.useContext(_d),
            t = e.itemId,
            n = e.filePath,
            r = Object(z.c)(Kc(n), Vf),
            a = Object(z.c)(di(t)),
            c = Object(z.c)(fi(t)),
            i = Of()({
              colormap: 'jet',
              nshades: 10,
              format: 'hex',
              alpha: 1,
            }).map(function (e, t) {
              return { rgb: e, offset: String(t / 9) }
            }),
            o = u.a.useMemo(
              function () {
                return [
                  {
                    z: r,
                    type: 'heatmap',
                    name: 'roi',
                    colorscale: i.map(function (e) {
                      var t = parseFloat(e.offset),
                        n = i.map(function (e) {
                          return parseFloat(e.offset)
                        })
                      return (
                        t === Math.max.apply(Math, Object(Yr.a)(n)) && (t = 1),
                        t === Math.min.apply(Math, Object(Yr.a)(n)) && (t = 0),
                        [t, e.rgb]
                      )
                    }),
                    hoverongaps: !1,
                    zsmooth: !1,
                    showlegend: !0,
                  },
                ]
              },
              [r, i],
            ),
            s = u.a.useMemo(
              function () {
                return {
                  width: a,
                  height: c - 50,
                  margin: { t: 30, l: 120, b: 30 },
                  dragmode: 'pan',
                  xaxis: {
                    autorange: !0,
                    zeroline: !1,
                    autotick: !0,
                    ticks: '',
                  },
                  yaxis: {
                    autorange: 'reversed',
                    zeroline: !1,
                    autotick: !0,
                    ticks: '',
                  },
                }
              },
              [a, c],
            ),
            l = Object(z.c)(hi(t)),
            d = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: { format: Object(z.c)(mi(t)), filename: l },
            }
          return Object(I.jsx)(jf.a, { data: o, layout: s, config: d })
        })
      function Vf(e, t) {
        return null != e && null != t ? Ma(e, t) : void 0 === e && void 0 === t
      }
      var Uf = n(564),
        Hf = n(270),
        Kf = n(1693),
        Zf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.b)(),
            r = Object(z.c)(
              ((e = t),
              function (t) {
                return qc(e)(t) && Dc(t).scatter[e].pending
              }),
            ),
            a = Object(z.c)(qc(t)),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return qc(e)(t) ? Dc(t).scatter[e].error : null
                }
              })(t),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  return qc(e)(t) && Dc(t).scatter[e].fulfilled
                }
              })(t),
            )
          return (
            u.a.useEffect(
              function () {
                a || n(Ec({ path: t }))
              },
              [n, a, t],
            ),
            r
              ? Object(I.jsx)(Hl.a, {})
              : null != c
              ? Object(I.jsx)(O.a, { color: 'error', children: c })
              : i
              ? Object(I.jsx)(Gf, {})
              : null
          )
        }),
        Gf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.filePath,
            r = t.itemId,
            a = Object(z.c)(
              ((e = n),
              function (t) {
                var n, r
                return null !==
                  (n =
                    null === (r = Dc(t).scatter[e]) || void 0 === r
                      ? void 0
                      : r.data) && void 0 !== n
                  ? n
                  : []
              }),
              Xf,
            ),
            c = Object(z.c)(qi(r)),
            i = Object(z.c)(Yi(r)),
            o = Object(z.c)(di(r)),
            s = Object(z.c)(fi(r)),
            l = u.a.useMemo(
              function () {
                return [
                  {
                    x: a[c],
                    y: a[i],
                    type: 'scatter',
                    mode: 'markers',
                    text: Object.keys(a[c]),
                    textposition: 'top center',
                    textfont: { family: 'Raleway, sans-serif' },
                    marker: { size: 5, color: Object.keys(a[c]) },
                  },
                ]
              },
              [a, c, i],
            ),
            d = u.a.useMemo(
              function () {
                return {
                  width: o,
                  height: s - 120,
                  margin: { t: 60, l: 50, b: 30 },
                  dragmode: 'pan',
                  autosize: !0,
                  xaxis: {
                    title: {
                      text: 'x: '.concat(c),
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f',
                      },
                    },
                  },
                  yaxis: {
                    title: {
                      text: 'y: '.concat(i),
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f',
                      },
                    },
                  },
                }
              },
              [c, i, o, s],
            ),
            f = Object(z.c)(hi(r)),
            j = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: { format: Object(z.c)(mi(r)), filename: f },
            }
          return Object(I.jsxs)('div', {
            children: [
              Object(I.jsx)(m.a, {
                sx: { display: 'flex' },
                children: Object(I.jsxs)(m.a, {
                  sx: { flexGrow: 1, ml: 1 },
                  children: [
                    Object(I.jsx)(qf, { dataKeys: Object.keys(a) }),
                    Object(I.jsx)(Yf, { dataKeys: Object.keys(a) }),
                  ],
                }),
              }),
              Object(I.jsx)(jf.a, { data: l, layout: d, config: j }),
            ],
          })
        }),
        qf = u.a.memo(function (e) {
          var t = e.dataKeys,
            n = u.a.useContext(_d).itemId,
            r = Object(z.b)(),
            a = Object(z.c)(qi(n))
          return Object(I.jsxs)(Hf.a, {
            variant: 'standard',
            sx: { m: 1, minWidth: 120 },
            children: [
              Object(I.jsx)(Uf.a, { children: 'xIndex' }),
              Object(I.jsx)(Kf.a, {
                label: 'smooth',
                value: a,
                onChange: function (e) {
                  r(cu({ itemId: n, xIndex: e.target.value }))
                },
                children: t.map(function (e) {
                  return Object(I.jsx)(Rl.a, { value: e, children: e })
                }),
              }),
            ],
          })
        }),
        Yf = u.a.memo(function (e) {
          var t = e.dataKeys,
            n = u.a.useContext(_d).itemId,
            r = Object(z.b)(),
            a = Object(z.c)(Yi(n))
          return Object(I.jsxs)(Hf.a, {
            variant: 'standard',
            sx: { m: 1, minWidth: 120 },
            children: [
              Object(I.jsx)(Uf.a, { children: 'yIndex' }),
              Object(I.jsx)(Kf.a, {
                label: 'smooth',
                value: a,
                onChange: function (e) {
                  r(iu({ itemId: n, yIndex: e.target.value }))
                },
                children: t.map(function (e) {
                  return Object(I.jsx)(Rl.a, { value: e, children: e })
                }),
              }),
            ],
          })
        })
      function Xf(e, t) {
        if (null != e && null != t) {
          var n = Object.keys(e),
            r = Object.keys(t)
          return (
            e === t ||
            (n.length === r.length &&
              n.every(function (e, t) {
                return r[t] === e
              }))
          )
        }
        return void 0 === e && void 0 === t
      }
      var $f = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.itemId,
            r = t.filePath,
            a = Object(z.b)(),
            c = Object(z.c)(
              ((e = r),
              function (t) {
                return zc(e)(t) && Dc(t).timeSeries[e].pending
              }),
            ),
            i = Object(z.c)(zc(r)),
            o = Object(z.c)(
              (function (e) {
                return function (t) {
                  return zc(e)(t) ? Dc(t).timeSeries[e].error : null
                }
              })(r),
            ),
            s = Object(z.c)(
              (function (e) {
                return function (t) {
                  return zc(e)(t) && Dc(t).timeSeries[e].fulfilled
                }
              })(r),
            )
          return (
            u.a.useEffect(
              function () {
                i || a(Ic({ path: r, itemId: n }))
              },
              [a, i, r, n],
            ),
            i
              ? null != o
                ? Object(I.jsx)(O.a, { color: 'error', children: o })
                : c || s
                ? Object(I.jsx)(Jf, {})
                : null
              : Object(I.jsx)(Hl.a, {})
          )
        }),
        Jf = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.filePath,
            r = t.itemId,
            a = Object(z.b)(),
            c = Object(z.c)(Rc(n), Qf),
            i = Object(z.c)(
              ((e = n),
              function (t) {
                return Dc(t).timeSeries[e].xrange
              }),
            ),
            o = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Dc(t).timeSeries[e].std
                }
              })(n),
            ),
            s = Object(z.c)(Ei(r)),
            l = Object(z.c)(Fi(r)),
            d = Object(z.c)(Ni(r)),
            f = Object(z.c)(Di(r)),
            j = Object(z.c)(Ri(r)),
            p = Object(z.c)(zi(r)),
            b = Object(z.c)(Li(r)),
            h = Object(z.c)(Mi(r)),
            m = Object(z.c)(di(r)),
            x = Object(z.c)(fi(r)),
            O = Object(z.c)(Wi(r)),
            v = Of()({
              colormap: 'jet',
              nshades: 100,
              format: 'hex',
              alpha: 1,
            }),
            g = u.a.useMemo(
              function () {
                return Object.fromEntries(
                  O.map(function (e) {
                    var t = i.map(function (t) {
                        return c[e][t]
                      }),
                      n = Number(e) - 1,
                      r = Math.floor((n % 10) * 10 + n / 10) % 100
                    if (h.includes(e) && s) {
                      var a = h.findIndex(function (t) {
                          return t === e
                        }),
                        u =
                          t.reduce(function (e, t) {
                            return e + t
                          }) / t.length,
                        d =
                          l *
                          Math.sqrt(
                            t.reduce(function (e, t) {
                              return e + Math.pow(t - u, 2)
                            }) / t.length,
                          )
                      t = t.map(function (e) {
                        return (e - u) / (d + 1e-10) + a
                      })
                    }
                    return [
                      e,
                      {
                        name: e,
                        x: i,
                        y: t,
                        visible: !!h.includes(e) || 'legendonly',
                        line: { color: v[r] },
                        error_y: {
                          type: 'data',
                          array:
                            !s && Object.keys(o).includes(e)
                              ? Object.values(o[e])
                              : null,
                          visible: !0,
                        },
                      },
                    ]
                  }),
                )
              },
              [c, h, s, l, v, o, i, O],
            ),
            y = u.a.useMemo(
              function () {
                return h.map(function (e) {
                  return {
                    x: Number(i[i.length - 1]) + i.length / 10,
                    y: g[e].y[i.length - 1],
                    xref: 'x',
                    yref: 'y',
                    text: 'cell: '.concat(e),
                    arrowhead: 1,
                    ax: 0,
                    ay: -10,
                  }
                })
              },
              [g, h, i],
            ),
            w = u.a.useMemo(
              function () {
                return {
                  margin: { t: 60, l: 50, b: 30 },
                  dragmode: 'pan',
                  autosize: !0,
                  width: m,
                  height: x - 50,
                  xaxis: {
                    range: [b.left, b.right],
                    showgrid: d,
                    showline: f,
                    showticklabels: j,
                    zeroline: p,
                  },
                  yaxis: {
                    showgrid: d,
                    showline: f,
                    showticklabels: j,
                    zeroline: p,
                  },
                  annotations: y,
                }
              },
              [b, d, f, j, p, y, m, x],
            ),
            k = Object(z.c)(hi(r)),
            C = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: { format: Object(z.c)(mi(r)), filename: k },
            }
          return Object(I.jsx)(jf.a, {
            data: Object.values(g),
            layout: w,
            config: C,
            onLegendClick: function (e) {
              var t = O[e.curveNumber],
                c = h.includes(t)
                  ? h.filter(function (e) {
                      return e !== t
                    })
                  : [].concat(Object(Yr.a)(h), [t])
              return (
                a(Jo({ itemId: r, drawOrderList: c })),
                h.includes(t) || a(kc({ path: n, index: t })),
                !1
              )
            },
          })
        })
      function Qf(e, t) {
        if (null != e && null != t) {
          var n = Object.entries(e),
            r = Object.entries(t)
          return (
            e === t ||
            (n.length === r.length &&
              n.every(function (e, t) {
                var n = Object(N.a)(e, 2),
                  a = n[0],
                  c = n[1],
                  i = Object(N.a)(r[t], 2),
                  o = i[0],
                  u = i[1]
                return (
                  o === a &&
                  (function (e, t) {
                    var n = Object.entries(e),
                      r = Object.entries(t)
                    return (
                      e === t ||
                      (n.length === r.length &&
                        n.every(function (e, t) {
                          var n = Object(N.a)(e, 2),
                            a = n[0],
                            c = n[1],
                            i = Object(N.a)(r[t], 2),
                            o = i[0],
                            u = i[1]
                          return o === a && u === c
                        }))
                    )
                  })(u, c)
                )
              }))
          )
        }
        return void 0 === e && void 0 === t
      }
      var ej = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.b)(),
            r = Object(z.c)(
              ((e = t),
              function (t) {
                return Yc(e)(t) && Dc(t).bar[e].pending
              }),
            ),
            a = Object(z.c)(Yc(t)),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Yc(e)(t) ? Dc(t).bar[e].error : null
                }
              })(t),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Yc(e)(t) && Dc(t).bar[e].fulfilled
                }
              })(t),
            )
          return (
            u.a.useEffect(
              function () {
                a || n(Fc({ path: t }))
              },
              [n, a, t],
            ),
            r
              ? Object(I.jsx)(Hl.a, {})
              : null != c
              ? Object(I.jsx)(O.a, { color: 'error', children: c })
              : i
              ? Object(I.jsx)(tj, {})
              : null
          )
        }),
        tj = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d),
            n = t.filePath,
            r = t.itemId,
            a = Object(z.c)(
              ((e = n),
              function (t) {
                var n, r
                return null !==
                  (n =
                    null === (r = Dc(t).bar[e]) || void 0 === r
                      ? void 0
                      : r.data) && void 0 !== n
                  ? n
                  : []
              }),
              rj,
            ),
            c = Object(z.c)(di(r)),
            i = Object(z.c)(fi(r)),
            o = Object(z.c)(Gi(r)),
            s = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n, r
                  return null !==
                    (n =
                      null === (r = Dc(t).bar[e]) || void 0 === r
                        ? void 0
                        : r.index) && void 0 !== n
                    ? n
                    : []
                }
              })(n),
            ),
            l = u.a.useMemo(
              function () {
                return [
                  { x: Object.keys(a[o]), y: Object.values(a[o]), type: 'bar' },
                ]
              },
              [a, o],
            ),
            d = u.a.useMemo(
              function () {
                return {
                  width: c,
                  height: i - 120,
                  margin: { t: 60, l: 50, b: 30 },
                  dragmode: 'pan',
                  autosize: !0,
                }
              },
              [c, i],
            ),
            f = Object(z.c)(hi(r)),
            j = {
              displayModeBar: !0,
              responsive: !0,
              toImageButtonOptions: { format: Object(z.c)(mi(r)), filename: f },
            }
          return Object(I.jsxs)('div', {
            children: [
              Object(I.jsx)(m.a, {
                sx: { display: 'flex' },
                children: Object(I.jsx)(m.a, {
                  sx: { flexGrow: 1, ml: 1 },
                  children: Object(I.jsx)(nj, { dataKeys: s }),
                }),
              }),
              Object(I.jsx)(jf.a, { data: l, layout: d, config: j }),
            ],
          })
        }),
        nj = u.a.memo(function (e) {
          var t = e.dataKeys,
            n = u.a.useContext(_d).itemId,
            r = Object(z.b)(),
            a = Object(z.c)(Gi(n))
          return Object(I.jsxs)(Hf.a, {
            variant: 'standard',
            sx: { m: 1, minWidth: 120 },
            children: [
              Object(I.jsx)(Uf.a, { children: 'index' }),
              Object(I.jsx)(Kf.a, {
                label: 'smooth',
                value: ''.concat(a),
                onChange: function (e) {
                  r(ou({ itemId: n, index: e.target.value }))
                },
                children: t.map(function (e, t) {
                  return Object(I.jsx)(Rl.a, { value: t, children: e })
                }),
              }),
            ],
          })
        })
      function rj(e, t) {
        if (null != e && null != t) {
          var n = Object.keys(e),
            r = Object.keys(t)
          return (
            e === t ||
            (n.length === r.length &&
              n.every(function (e, t) {
                return r[t] === e
              }))
          )
        }
        return void 0 === e && void 0 === t
      }
      var aj = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.b)(),
            r = Object(z.c)(
              ((e = t),
              function (t) {
                return Xc(e)(t) && Dc(t).html[e].pending
              }),
            ),
            a = Object(z.c)(Xc(t)),
            c = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Xc(e)(t) ? Dc(t).html[e].error : null
                }
              })(t),
            ),
            i = Object(z.c)(
              (function (e) {
                return function (t) {
                  return Xc(e)(t) && Dc(t).html[e].fulfilled
                }
              })(t),
            )
          return (
            u.a.useEffect(
              function () {
                a || n(Nc({ path: t }))
              },
              [n, a, t],
            ),
            r
              ? Object(I.jsx)(Hl.a, {})
              : null != c
              ? Object(I.jsx)(O.a, { color: 'error', children: c })
              : i
              ? Object(I.jsx)(cj, {})
              : null
          )
        }),
        cj = u.a.memo(function () {
          var e,
            t = u.a.useContext(_d).filePath,
            n = Object(z.c)(
              ((e = t),
              function (t) {
                var n, r
                return null !==
                  (n =
                    null === (r = Dc(t).html[e]) || void 0 === r
                      ? void 0
                      : r.data) && void 0 !== n
                  ? n
                  : ''
              }),
            )
          return Object(I.jsx)('div', {
            dangerouslySetInnerHTML: { __html: n },
            style: { overflow: 'scroll', display: 'flex', height: '90%' },
          })
        }),
        ij = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.c)(bi(t)),
            r = Object(z.c)(pi(t)),
            a = Object(z.c)(ji(t))
          return null != n && null != a
            ? Object(I.jsx)(_d.Provider, {
                value: { nodeId: r, filePath: n, dataType: a, itemId: t },
                children: Object(I.jsx)(oj, { dataType: a }),
              })
            : Object(I.jsx)('div', {
                children: 'Please select item correctly.',
              })
        }),
        oj = u.a.memo(function (e) {
          switch (e.dataType) {
            case On:
              return Object(I.jsx)(Pd, {})
            case hn:
              return Object(I.jsx)($f, {})
            case mn:
              return Object(I.jsx)(pf, {})
            case xn:
              return Object(I.jsx)(wf, {})
            case vn:
              return Object(I.jsx)(Wf, {})
            case gn:
              return Object(I.jsx)(Zf, {})
            case yn:
              return Object(I.jsx)(ej, {})
            case In:
              return Object(I.jsx)(aj, {})
            default:
              return null
          }
        }),
        uj = u.a.memo(function (e) {
          var t = e.open,
            n = e.onClose,
            r = e.nodeId,
            a = Object(z.b)(),
            c = function () {
              n(), a(Io())
            }
          return Object(I.jsxs)(ha.a, {
            open: t,
            onClose: c,
            fullWidth: !0,
            children: [
              Object(I.jsx)(sj, { onClose: c, nodeId: r }),
              Object(I.jsx)(Ll.a, {
                dividers: !0,
                sx: { pt: 1, px: 2 },
                children: t && Object(I.jsx)(lj, { nodeId: r }),
              }),
            ],
          })
        }),
        sj = u.a.memo(function (e) {
          var t = e.nodeId,
            n = e.onClose,
            r = Object(z.c)(zt(t))
          return Object(I.jsxs)(xa.a, {
            sx: { m: 0, p: 2 },
            children: [
              'Output of ',
              r,
              Object(I.jsx)(d.a, {
                onClick: n,
                sx: { position: 'absolute', right: 8, top: 10 },
                children: Object(I.jsx)(j.a, {}),
              }),
            ],
          })
        }),
        lj = u.a.memo(function (e) {
          var t = e.nodeId,
            n = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = Dn(t)
                  if (Tn(n)) {
                    var r = n.runResult[e]
                    if (Object.keys(n.runResult).includes(e) && Pn(r))
                      return Object.keys(r.outputPaths)
                  }
                  return []
                }
              })(t),
              La,
            ),
            r = u.a.useState(n[0]),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1]
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(dj, {
                outputKeyList: n,
                selectedOutoutKey: c,
                onSelectOutput: i,
              }),
              Object(I.jsx)(fj, { nodeId: t, outputKey: c }),
            ],
          })
        }),
        dj = u.a.memo(function (e) {
          var t = e.selectedOutoutKey,
            n = e.outputKeyList,
            r = e.onSelectOutput
          return Object(I.jsx)(sf.a, {
            value: t,
            onChange: function (e, t) {
              r(t)
            },
            variant: 'scrollable',
            scrollButtons: 'auto',
            sx: Object(H.a)({}, '& .'.concat(lf.a.scrollButtons), {
              '&.Mui-disabled': { opacity: 0.3 },
            }),
            children: n.map(function (e) {
              return Object(I.jsx)(df.a, {
                value: e,
                label: e,
                sx: { textTransform: 'none' },
              })
            }),
          })
        }),
        fj = u.a.memo(function (e) {
          var t = e.nodeId,
            n = e.outputKey,
            r = Object(z.b)(),
            a = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  var r = Un(e)(n)
                  if (Object.keys(r).includes(t)) return r[t].path
                  throw new Error('key error. outputKey:'.concat(t))
                }
              })(t, n),
            ),
            c = Object(z.c)(
              (function (e, t) {
                return function (n) {
                  var r = Un(e)(n)
                  if (Object.keys(r).includes(t)) return r[t].type
                  throw new Error('key error. outputKey:'.concat(t))
                }
              })(t, n),
            ),
            i = Object(z.c)(
              (function (e, t, n) {
                return function (r) {
                  for (
                    var a = ui(r), c = null, i = 0, o = Object.entries(a);
                    i < o.length;
                    i++
                  ) {
                    var u = Object(N.a)(o[i], 2),
                      s = u[0],
                      l = u[1]
                    l.nodeId === e &&
                      l.filePath === t &&
                      l.dataType === n &&
                      l.isWorkflowDialog &&
                      (c = Number(s))
                  }
                  return c
                }
              })(t, a, c),
            )
          return (
            u.a.useEffect(
              function () {
                null === i && r(wo({ nodeId: t, filePath: a, dataType: c }))
              },
              [r, t, a, c, i],
            ),
            Object(I.jsx)(m.a, {
              sx: { mx: 1, my: 2 },
              children: null != i && Object(I.jsx)(ij, { itemId: i }),
            })
          )
        }),
        jj = function (e) {
          return function (t) {
            return null != t.filesTree[e] ? t.filesTree[e] : void 0
          }
        },
        pj = 'filesTree',
        bj = Object(Re.c)(
          ''.concat(pj, '/getFilesTree'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.prev = 0), (e.next = 3), ws(t)
                        case 3:
                          return (r = e.sent), e.abrupt('return', r)
                        case 7:
                          return (
                            (e.prev = 7),
                            (e.t0 = e.catch(0)),
                            e.abrupt('return', n.rejectWithValue(e.t0))
                          )
                        case 10:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[0, 7]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        hj = n(114)
      function mj(e) {
        return e.map(function (e) {
          return e.isdir
            ? { path: e.path, name: e.name, isDir: !0, nodes: mj(e.nodes) }
            : { path: e.path, name: e.name, isDir: !1 }
        })
      }
      function xj(e, t) {
        var n,
          r = null,
          a = Object(hj.a)(t)
        try {
          for (a.s(); !(n = a.n()).done; ) {
            var c = n.value
            if (e === c.path) {
              r = c
              break
            }
            if (c.isDir && null != (r = xj(e, c.nodes))) break
          }
        } catch (i) {
          a.e(i)
        } finally {
          a.f()
        }
        return r
      }
      var Oj = u.a.memo(function (e) {
          var t = e.open,
            n = e.initialFilePath,
            r = e.onClickCancel,
            a = e.onClickOk,
            c = e.title,
            i = e.fileType,
            o = void 0 === i ? ys : i,
            s = e.multiSelect
          u.a.useEffect(
            function () {
              j(n)
            },
            [n],
          )
          var l = u.a.useState(n),
            d = Object(N.a)(l, 2),
            f = d[0],
            j = d[1],
            p = Object(Bl.a)()
          return Object(I.jsxs)(ha.a, {
            open: t,
            fullWidth: !0,
            children: [
              Object(I.jsx)(xa.a, {
                children: null !== c && void 0 !== c ? c : 'Select File',
              }),
              Object(I.jsxs)(Ll.a, {
                dividers: !0,
                children: [
                  Object(I.jsx)('div', {
                    style: {
                      height: 300,
                      overflow: 'auto',
                      marginBottom: p.spacing(1),
                      border: '1px solid',
                      padding: p.spacing(1),
                      borderColor: p.palette.divider,
                    },
                    children: Object(I.jsx)(vj, {
                      setSelectedFilePath: j,
                      multiSelect: s,
                      fileType: o,
                      selectedFilePath: f,
                    }),
                  }),
                  Object(I.jsx)(O.a, {
                    variant: 'subtitle1',
                    children: 'Select File',
                  }),
                  Object(I.jsx)(wj, { path: f }),
                ],
              }),
              Object(I.jsxs)(ma.a, {
                children: [
                  Object(I.jsx)(G.a, {
                    onClick: function () {
                      j(n), r()
                    },
                    variant: 'outlined',
                    color: 'inherit',
                    children: 'cancel',
                  }),
                  Object(I.jsx)(G.a, {
                    onClick: function () {
                      a(f)
                    },
                    color: 'primary',
                    variant: 'outlined',
                    children: 'OK',
                  }),
                ],
              }),
            ],
          })
        }),
        vj = u.a.memo(function (e) {
          var t = e.setSelectedFilePath,
            n = e.selectedFilePath,
            r = e.fileType,
            a = e.multiSelect,
            c = (function (e) {
              var t = Object(z.b)(),
                n = Object(z.c)(
                  (function (e) {
                    return function (t) {
                      var n
                      return null === (n = jj(e)(t)) || void 0 === n
                        ? void 0
                        : n.tree
                    }
                  })(e),
                ),
                r = Object(z.c)(
                  (function (e) {
                    return function (t) {
                      var n, r
                      return (
                        null !==
                          (n =
                            null === (r = jj(e)(t)) || void 0 === r
                              ? void 0
                              : r.isLatest) &&
                        void 0 !== n &&
                        n
                      )
                    }
                  })(e),
                ),
                a = Object(z.c)(
                  (function (e) {
                    return function (t) {
                      var n, r
                      return (
                        null !==
                          (n =
                            null === (r = jj(e)(t)) || void 0 === r
                              ? void 0
                              : r.isLoading) &&
                        void 0 !== n &&
                        n
                      )
                    }
                  })(e),
                )
              return (
                u.a.useEffect(
                  function () {
                    r || a || t(bj(e))
                  },
                  [r, a, e, t],
                ),
                [n, a]
              )
            })(r),
            i = Object(N.a)(c, 2),
            o = i[0],
            s = i[1],
            l = function (e) {
              Array.isArray(n) &&
                (n.includes(e)
                  ? t(
                      n.filter(function (t) {
                        return e !== t
                      }),
                    )
                  : t(n.concat(e)))
            },
            d = function (e, r) {
              if (null != o && Array.isArray(n)) {
                var a = xj(e, o)
                if (null != a && a.isDir) {
                  var c = a.nodes
                    .filter(function (e) {
                      return !e.isDir
                    })
                    .map(function (e) {
                      return e.path
                    })
                  t(
                    r
                      ? Array.from(new Set(n.concat(c)))
                      : n.filter(function (e) {
                          return !c.includes(e)
                        }),
                  )
                }
              }
            }
          return Object(I.jsxs)('div', {
            children: [
              s && Object(I.jsx)(Hl.a, {}),
              Object(I.jsx)(ku.a, {
                disableSelection: a,
                multiSelect: a,
                onNodeSelect: function (e, n) {
                  if (!a && null != o) {
                    var r = n
                    ;(function (e, t) {
                      var n = xj(e, t)
                      if (null != n) return n.isDir
                      throw new Error('failed to get node: '.concat(e))
                    })(r, o) || t(r)
                  }
                },
                children:
                  null === o || void 0 === o
                    ? void 0
                    : o.map(function (e) {
                        return Object(I.jsx)(gj, {
                          node: e,
                          selectedFilePath: n,
                          multiSelect: a,
                          onCheckDir: d,
                          onCheckFile: l,
                        })
                      }),
              }),
            ],
          })
        }),
        gj = u.a.memo(function (e) {
          var t = e.node,
            n = e.selectedFilePath,
            r = e.multiSelect,
            a = e.onCheckDir,
            c = e.onCheckFile
          if (t.isDir) {
            var i =
                Array.isArray(n) &&
                t.nodes
                  .filter(function (e) {
                    return !e.isDir
                  })
                  .map(function (e) {
                    return e.path
                  })
                  .every(function (e) {
                    return n.includes(e)
                  }),
              o =
                Array.isArray(n) &&
                t.nodes
                  .filter(function (e) {
                    return !e.isDir
                  })
                  .map(function (e) {
                    return e.path
                  })
                  .every(function (e) {
                    return !n.includes(e)
                  }),
              u = !(i || o)
            return Object(I.jsx)(Cu.a, {
              icon: Object(I.jsx)(Ad.a, { htmlColor: 'skyblue' }),
              nodeId: t.path,
              label:
                r &&
                t.nodes.filter(function (e) {
                  return !e.isDir
                }).length > 0
                  ? Object(I.jsx)(yj, {
                      label: t.name,
                      checkboxProps: {
                        indeterminate: u,
                        checked: i,
                        onClick: function (e) {
                          e.stopPropagation()
                        },
                        onChange: function (e) {
                          return a(t.path, e.target.checked)
                        },
                      },
                    })
                  : t.name,
              children: t.nodes.map(function (e, t) {
                return Object(I.jsx)(
                  gj,
                  {
                    node: e,
                    selectedFilePath: n,
                    multiSelect: r,
                    onCheckDir: a,
                    onCheckFile: c,
                  },
                  t,
                )
              }),
            })
          }
          return Object(I.jsx)(Cu.a, {
            icon: Object(I.jsx)(Bd.a, { fontSize: 'small' }),
            nodeId: t.path,
            label: r
              ? Object(I.jsx)(yj, {
                  label: t.name,
                  checkboxProps: {
                    checked: Array.isArray(n) && n.includes(t.path),
                    onChange: function () {
                      return c(t.path)
                    },
                  },
                })
              : t.name,
            onClick: function () {
              return c(t.path)
            },
          })
        }),
        yj = u.a.memo(function (e) {
          var t = e.label,
            n = e.checkboxProps
          return Object(I.jsxs)(m.a, {
            display: 'flex',
            alignItems: 'center',
            children: [
              Object(I.jsx)(m.a, { flexGrow: 1, children: t }),
              Object(I.jsx)(m.a, {
                children: Object(I.jsx)(
                  ba.a,
                  Object(K.a)(
                    Object(K.a)({}, n),
                    {},
                    {
                      disableRipple: !0,
                      size: 'small',
                      sx: { marginRight: '4px', padding: '2px' },
                    },
                  ),
                ),
              }),
            ],
          })
        }),
        wj = u.a.memo(function (e) {
          var t = e.path
          return Object(I.jsx)(O.a, {
            variant: 'subtitle2',
            children: t
              ? Array.isArray(t)
                ? t.map(function (e) {
                    return Object(I.jsx)('li', { children: e })
                  })
                : t
              : '---',
          })
        })
      var Ij = n(1781),
        kj = n(1783),
        Cj = {
          filePath: '',
          open: !1,
          fileTreeType: void 0,
          multiSelect: !1,
          onSelectFile: function () {
            return null
          },
        },
        Sj = u.a.memo(function (e) {
          var t = Object(z.c)(Gt),
            n = Object(z.b)(),
            r = Object(o.useState)(''),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1],
            s = Object(o.useState)(Cj),
            l = Object(N.a)(s, 2),
            d = l[0],
            f = l[1],
            j = Object(o.useState)({
              anchorElRef: { current: null },
              message: '',
            }),
            p = Object(N.a)(j, 2),
            b = p[0],
            h = p[1],
            m = Object(z.c)(qt),
            x = u.a.useState(),
            O = Object(N.a)(x, 2),
            v = O[0],
            g = O[1],
            y = u.a.useRef(null),
            w = Object(bs.a)(
              function () {
                return {
                  accept: os,
                  drop: function (e, t) {
                    var n = void 0,
                      r = t.getClientOffset()
                    return (
                      null != y.current &&
                        null != r &&
                        null != v &&
                        (n = v.project({
                          x: r.x - y.current.offsetLeft - 40,
                          y: r.y - y.current.offsetTop - 40,
                        })),
                      { position: n }
                    )
                  },
                }
              },
              [v],
            ),
            k = Object(N.a)(w, 2)[1]
          return Object(I.jsx)('div', {
            className: 'flow',
            children: Object(I.jsxs)(Yl.Provider, {
              value: { onOpen: i, onOpenDialogFile: f, onMessageError: h },
              children: [
                Object(I.jsx)(Et.d, {
                  children: Object(I.jsx)('div', {
                    className: 'reactflow-wrapper',
                    ref: y,
                    children: Object(I.jsxs)(Et.f, {
                      ref: k,
                      elements: t,
                      onElementsRemove: function (e) {
                        n(As(e))
                      },
                      onConnect: function (e) {
                        n(
                          Ms(
                            Object(Et.e)(
                              Object(K.a)(
                                Object(K.a)({}, e),
                                {},
                                {
                                  animated: !1,
                                  style: { width: 5 },
                                  type: 'buttonedge',
                                },
                              ),
                              t,
                            ),
                          ),
                        )
                      },
                      onLoad: function (e) {
                        return g(e)
                      },
                      onDragOver: function (e) {
                        e.preventDefault(), (e.dataTransfer.dropEffect = 'move')
                      },
                      onNodeDragStop: function (e, t) {
                        n(
                          Bs({
                            nodeId: t.id,
                            coord: { x: t.position.x, y: t.position.y },
                          }),
                        )
                      },
                      nodeTypes: of,
                      edgeTypes: uf,
                      defaultPosition: [m.x, m.y],
                      defaultZoom: m.zoom,
                      onMoveEnd: function (e) {
                        void 0 !== e && n(Ls(e))
                      },
                      children: [
                        Object(I.jsx)(Wl, Object(K.a)({}, e)),
                        Object(I.jsx)(Et.a, {}),
                      ],
                    }),
                  }),
                }),
                c &&
                  Object(I.jsx)(uj, {
                    nodeId: c,
                    open: !0,
                    onClose: function () {
                      return i('')
                    },
                  }),
                d.open &&
                  Object(I.jsx)(Oj, {
                    multiSelect: d.multiSelect,
                    initialFilePath: d.filePath,
                    open: d.open,
                    onClickOk: function (e) {
                      d.onSelectFile(e), f(Cj)
                    },
                    onClickCancel: function () {
                      f(Cj)
                    },
                    fileType: d.fileTreeType,
                  }),
                (null === b || void 0 === b ? void 0 : b.message) &&
                  Object(I.jsx)(Ij.a, {
                    open: !0,
                    anchorEl: b.anchorElRef.current,
                    onClose: function () {
                      return h({ anchorElRef: { current: null }, message: '' })
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    transformOrigin: { vertical: 'bottom', horizontal: 'left' },
                    children: Object(I.jsx)('div', {
                      style: { margin: 8 },
                      children: Object(I.jsx)(kj.a, {
                        error: !0,
                        children: b.message,
                      }),
                    }),
                  }),
              ],
            }),
          })
        }),
        _j = n(1761),
        Pj = n(859),
        Tj = n(1784),
        Ej = n(1760),
        Fj = function (e) {
          return e.rightDrawer.open
        },
        Nj = function (e) {
          return e.rightDrawer.mode
        },
        Dj = function (e) {
          return e.rightDrawer.currendNodeId
        },
        Rj = 'algorithmNode',
        zj = Object(Re.c)(
          ''.concat(Rj, '/getAlgoParams'),
          (function () {
            var e = Object(F.a)(
              R.a.mark(function e(t, n) {
                var r, a, c
                return R.a.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (r = t.algoName),
                            (a = n.rejectWithValue),
                            (e.prev = 2),
                            (e.next = 5),
                            Ku(r)
                          )
                        case 5:
                          return (c = e.sent), e.abrupt('return', c)
                        case 9:
                          return (
                            (e.prev = 9),
                            (e.t0 = e.catch(2)),
                            e.abrupt('return', a(e.t0))
                          )
                        case 12:
                        case 'end':
                          return e.stop()
                      }
                  },
                  e,
                  null,
                  [[2, 9]],
                )
              }),
            )
            return function (t, n) {
              return e.apply(this, arguments)
            }
          })(),
        ),
        Lj = Object(Re.d)({
          name: Rj,
          initialState: {},
          reducers: {
            updateParam: function (e, t) {
              var n = t.payload,
                r = n.nodeId,
                a = n.path,
                c = n.newValue,
                i = e[r].params
              if (null != i) {
                var o = Ft(a, i)
                null != o && ((o.value = c), (e[r].isUpdated = !0))
              }
            },
          },
          extraReducers: function (e) {
            e.addCase(zj.fulfilled, function (e, t) {
              e[t.meta.arg.nodeId].params = Dt(t.payload)
            })
              .addCase(Gu.fulfilled, function (e, t) {
                var n,
                  r = t.meta.arg,
                  a = r.node,
                  c = r.functionPath,
                  i = r.name,
                  o = t.payload
                ;(null === (n = a.data) || void 0 === n ? void 0 : n.type) ===
                  Bt &&
                  (e[a.id] = {
                    functionPath: c,
                    name: i,
                    params: Dt(o),
                    isUpdated: !1,
                  })
              })
              .addCase(As, function (e, t) {
                t.payload
                  .filter(function (e) {
                    return Vt(e)
                  })
                  .forEach(function (t) {
                    var n
                    ;(null === (n = t.data) || void 0 === n
                      ? void 0
                      : n.type) === Bt && delete e[t.id]
                  })
              })
              .addCase(Ws, function (e, t) {
                Object.keys(e).includes(t.payload) && delete e[t.payload]
              })
              .addCase(Br.fulfilled, function (e, t) {
                var n = {}
                return (
                  Object.values(t.payload.nodeDict)
                    .filter(xs)
                    .forEach(function (e) {
                      null != e.data &&
                        (n[e.id] = {
                          name: e.data.label,
                          functionPath: e.data.path,
                          params: e.data.param,
                          isUpdated: !1,
                        })
                    }),
                  n
                )
              })
              .addMatcher(
                Object(Re.e)(vr.fulfilled, gr.fulfilled),
                function (e, t) {
                  var n = t.meta.arg.runPostData
                  Object.values(n.nodeDict)
                    .filter(xs)
                    .forEach(function (t) {
                      e[t.id].isUpdated = !1
                    })
                },
              )
          },
        }),
        Mj = Lj.actions.updateParam,
        Aj = Lj.reducer,
        Wj = u.a.memo(function () {
          var e = u.a.useContext(Uj),
            t = Object(z.b)(),
            n = Object(z.c)(zt(e)),
            r = Object(z.c)(
              (function (e) {
                return function (t) {
                  return null !== Rt(e)(t).params
                }
              })(e),
            ),
            a = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n, r
                  return Object.keys(
                    null !==
                      (n =
                        null === (r = Rt(e)(t)) || void 0 === r
                          ? void 0
                          : r.params) && void 0 !== n
                      ? n
                      : {},
                  )
                }
              })(e),
              La,
            )
          return (
            Object(o.useEffect)(
              function () {
                r || t(zj({ nodeId: e, algoName: n }))
              },
              [t, e, n, r],
            ),
            Object(I.jsxs)('div', {
              style: { padding: 8 },
              children: [
                Object(I.jsx)(O.a, { variant: 'h5', children: n }),
                Object(I.jsx)('div', {
                  style: { paddingLeft: 8 },
                  children: a.map(function (e) {
                    return Object(I.jsx)(Bj, { paramKey: e }, e)
                  }),
                }),
              ],
            })
          )
        }),
        Bj = u.a.memo(function (e) {
          var t = e.paramKey,
            n = u.a.useContext(Uj),
            r = bl({
              paramSelector: function (e) {
                return (function (e, t) {
                  return function (n) {
                    var r = Lt(e)(n)
                    if (null != r) return r[t]
                    throw new Error('AlgorithmParam is null')
                  }
                })(n, e)
              },
              paramValueSelector: function (e) {
                return (function (e, t) {
                  return function (n) {
                    var r = Lt(e)(n)
                    if (null != r) {
                      var a = Ft(t, r)
                      return null === a || void 0 === a ? void 0 : a.value
                    }
                    throw new Error('AlgorithmParam is null')
                  }
                })(n, e)
              },
              paramUpdateActionCreator: function (e, t) {
                return Mj({ nodeId: n, path: e, newValue: t })
              },
            })
          return Object(I.jsx)(r, { paramKey: t })
        }),
        Vj = function () {
          switch (Object(z.c)(Nj)) {
            case Js:
              return Object(I.jsx)(ml, {})
            case Qs:
              return Object(I.jsx)(Hj, {})
            case el:
              return Object(I.jsx)(Sl, {})
            default:
              return null
          }
        },
        Uj = u.a.createContext(''),
        Hj = function () {
          var e = Object(z.c)(Dj)
          return null != e
            ? Object(I.jsx)(Uj.Provider, {
                value: e,
                children: Object(I.jsx)(Wj, {}),
              })
            : null
        },
        Kj = Object(x.a)(_j.a)(
          Object(H.a)({ width: 320, flexShrink: 0 }, '& .'.concat(Pj.a.paper), {
            width: 320,
          }),
        ),
        Zj = Object(x.a)('main')({ height: '100%' }),
        Gj = function () {
          var e = Object(z.c)(Fj),
            t = Object(z.b)(),
            n = Object(z.c)(function (e) {
              switch (Nj(e)) {
                case Js:
                  return 'NWB Setting'
                case Qs:
                  return 'Param From'
                case el:
                  return 'Snakemake'
                default:
                  return 'none'
              }
            })
          return Object(I.jsxs)(Kj, {
            open: e,
            anchor: 'right',
            variant: 'persistent',
            children: [
              Object(I.jsx)(Tj.a, {}),
              Object(I.jsxs)(m.a, {
                display: 'flex',
                alignItems: 'center',
                children: [
                  Object(I.jsx)(d.a, {
                    color: 'inherit',
                    onClick: function () {
                      return t(ol())
                    },
                    size: 'large',
                    children: Object(I.jsx)(Eu.a, {}),
                  }),
                  Object(I.jsx)(O.a, { variant: 'h6', children: n }),
                ],
              }),
              Object(I.jsx)(Ej.a, {}),
              Object(I.jsx)(Zj, { children: Object(I.jsx)(Vj, {}) }),
            ],
          })
        },
        qj = n(1776),
        Yj = function () {
          var e = Object(z.c)(Nn),
            t = Object(z.c)(wa)
          return Object(I.jsx)(I.Fragment, {
            children:
              e &&
              Object(I.jsxs)(I.Fragment, {
                children: [
                  Object(I.jsxs)(qj.a, {
                    container: !0,
                    paddingX: 2,
                    paddingBottom: 1,
                    children: [
                      Object(I.jsx)(Xj, { uid: e }),
                      t && Object(I.jsx)($j, { uid: e }),
                    ],
                  }),
                  Object(I.jsx)(Ej.a, {}),
                ],
              }),
          })
        },
        Xj = u.a.memo(function (e) {
          var t = e.uid
          return Object(I.jsx)(Jj, { label: 'ID', value: t })
        }),
        $j = u.a.memo(function (e) {
          var t = e.uid,
            n = Object(z.c)(_a(t))
          return Object(I.jsx)(Jj, { label: 'NAME', value: n })
        }),
        Jj = u.a.memo(function (e) {
          var t = e.label,
            n = e.value
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(qj.a, {
                item: !0,
                xs: 4,
                children: Object(I.jsxs)(O.a, {
                  variant: 'body2',
                  color: 'textSecondary',
                  children: [t, ':'],
                }),
              }),
              Object(I.jsx)(qj.a, {
                item: !0,
                xs: 8,
                children: Object(I.jsx)(O.a, {
                  variant: 'body2',
                  color: 'textSecondary',
                  children: n,
                }),
              }),
            ],
          })
        }),
        Qj = n(837),
        ep = u.a.memo(function (e) {
          var t = Object(z.c)(Fj)
          return Object(I.jsxs)(tp, {
            children: [
              Object(I.jsxs)(wu.a, {
                backend: Iu.a,
                children: [
                  Object(I.jsxs)(m.a, {
                    sx: { width: 240 },
                    borderRight: 1,
                    borderColor: Qj.a[300],
                    children: [
                      Object(I.jsx)(Yj, {}),
                      Object(I.jsx)(np, { children: Object(I.jsx)(us, {}) }),
                    ],
                  }),
                  Object(I.jsx)(rp, {
                    open: t,
                    children: Object(I.jsx)(Sj, Object(K.a)({}, e)),
                  }),
                ],
              }),
              Object(I.jsx)(Gj, {}),
            ],
          })
        }),
        tp = Object(x.a)('div')({ display: 'flex' }),
        np = Object(x.a)('div')({ overflow: 'auto' }),
        rp = Object(x.a)('main')(
          function (e) {
            var t = e.theme
            return {
              flexDirection: 'column',
              flexGrow: 1,
              height: '90vh',
              transition: t.transitions.create('margin', {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.leavingScreen,
              }),
              marginRight: -320,
            }
          },
          function (e) {
            var t = e.open,
              n = e.theme
            return t
              ? {
                  transition: n.transitions.create('margin', {
                    easing: n.transitions.easing.easeOut,
                    duration: n.transitions.duration.enteringScreen,
                  }),
                  marginRight: 0,
                }
              : void 0
          },
        ),
        ap = ep,
        cp = function () {
          var e = Object(z.b)()
          return Object(I.jsx)(ip, {
            elevation: 1,
            variant: 'outlined',
            children: Object(I.jsx)(m.a, {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              children: Object(I.jsx)(op, {
                onClick: function () {
                  e(go())
                },
                children: Object(I.jsx)(Nu.a, {
                  fontSize: 'large',
                  color: 'primary',
                }),
              }),
            }),
          })
        },
        ip = Object(x.a)(ia.a)(function (e) {
          var t = e.theme
          return {
            width: 260,
            height: 255,
            border: 'dashed',
            borderWidth: 2,
            borderColor: t.palette.divider,
            margin: t.spacing(1),
          }
        }),
        op = Object(x.a)(G.a)({ width: '100%', height: '100%' })
      function up(e, t) {
        return u.a.useCallback(
          function (t) {
            var n = e(t),
              r = n.onMouseMove,
              a = n.onMouseUp
            document.addEventListener('mousemove', r),
              document.addEventListener(
                'mouseup',
                function (e) {
                  document.removeEventListener('mousemove', r),
                    a.call(document, e)
                },
                { once: !0 },
              )
          },
          [t],
        )
      }
      var sp = n(877),
        lp = n(1763),
        dp = n(881),
        fp = n(860),
        jp = n.n(fp),
        pp = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.b)(),
            r = Object(z.c)(ji(t)),
            a = Object(z.c)(bi(t)),
            c = Object(z.c)(Xi(t))
          return Object(I.jsx)(bp, {
            onClickDeleteMenu: function () {
              n(
                Qi(
                  c && null != a && null != r
                    ? { itemId: t, deleteData: !0, filePath: a, dataType: r }
                    : { itemId: t, deleteData: !1 },
                ),
              )
            },
            onClickInsertMenu: function () {
              n(yo(t))
            },
          })
        }),
        bp = u.a.memo(function (e) {
          var t = e.onClickDeleteMenu,
            n = e.onClickInsertMenu,
            r = u.a.useState(!1),
            a = Object(N.a)(r, 2),
            c = a[0],
            i = a[1],
            o = u.a.useRef(null)
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                ref: o,
                onClick: function (e) {
                  e.stopPropagation(),
                    i(function (e) {
                      return !e
                    })
                },
                children: Object(I.jsx)(jp.a, {}),
              }),
              Object(I.jsxs)(sp.a, {
                anchorEl: o.current,
                open: c,
                onClose: function () {
                  i(!1)
                },
                children: [
                  Object(I.jsxs)(Rl.a, {
                    onClick: function (e) {
                      e.stopPropagation(), n(), i(!1)
                    },
                    children: [
                      Object(I.jsx)(dp.a, {
                        children: Object(I.jsx)(Nu.a, {}),
                      }),
                      Object(I.jsx)(lp.a, {
                        children: 'Insert into next column',
                      }),
                    ],
                  }),
                  Object(I.jsxs)(Rl.a, {
                    onClick: function (e) {
                      e.stopPropagation(), t(), i(!1)
                    },
                    children: [
                      Object(I.jsx)(dp.a, {
                        children: Object(I.jsx)(pa.a, {}),
                      }),
                      Object(I.jsx)(lp.a, { children: 'Delete' }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }),
        hp = n(1779),
        mp = function (e) {
          var t = e.dataType,
            n = e.selectedNodeId,
            r = e.selectedFilePath,
            a = e.onSelect,
            c = e.label,
            i = Object(z.c)(function (e) {
              var n = (function (e) {
                return e.inputNode
              })(e)
              return Object.entries(n)
                .map(function (t) {
                  var n = Object(N.a)(t, 2),
                    r = n[0],
                    a = n[1]
                  return {
                    nodeId: r,
                    filePath: a.selectedFilePath,
                    fileType: a.fileType,
                    dataType: xp(a.fileType),
                    nodeName: Xt(r)(e),
                  }
                })
                .filter(function (e) {
                  return null != e.filePath
                })
                .filter(function (e) {
                  var n = e.dataType
                  return null == t || n === t
                })
            }),
            o = Object(z.c)(Nn),
            s = Object(z.c)(function (e) {
              if (null != o) {
                var n = (function (e) {
                  var t = Dn(e)
                  return Tn(t)
                    ? Object.entries(t.runResult)
                        .map(function (e) {
                          var t = Object(N.a)(e, 2)
                          return { nodeId: t[0], nodeResult: t[1] }
                        })
                        .filter(Bn)
                    : []
                })(e)
                return n.map(function (n) {
                  var r = n.nodeId,
                    a = n.nodeResult
                  return {
                    nodeId: r,
                    nodeName: Xt(r)(e),
                    paths: Object.entries(a.outputPaths)
                      .map(function (e) {
                        var t = Object(N.a)(e, 2),
                          n = t[0],
                          r = t[1]
                        return { outputKey: n, filePath: r.path, type: r.type }
                      })
                      .filter(function (e) {
                        var n = e.type
                        return null == t || n === t
                      }),
                  }
                })
              }
              return []
            }),
            l = u.a.useState(!1),
            d = Object(N.a)(l, 2),
            f = d[0],
            j = d[1],
            p = function () {
              j(!1)
            },
            b = function (e, t, n, r) {
              a(e, t, n, r), p()
            },
            h = []
          return (
            i.forEach(function (e) {
              var t = e.filePath
              Array.isArray(t)
                ? t.forEach(function (t) {
                    h.push(
                      Object(I.jsx)(
                        Rl.a,
                        {
                          value: ''.concat(e.nodeId, '/').concat(t),
                          onClick: function () {
                            return b(
                              e.nodeId,
                              null !== t && void 0 !== t ? t : '',
                              e.dataType,
                            )
                          },
                          children: Kt(t),
                        },
                        e.nodeId,
                      ),
                    )
                  })
                : h.push(
                    Object(I.jsx)(
                      Rl.a,
                      {
                        value: ''.concat(e.nodeId, '/').concat(e.filePath),
                        onClick: function () {
                          return b(
                            e.nodeId,
                            null !== t && void 0 !== t ? t : '',
                            e.dataType,
                          )
                        },
                        children: e.nodeName,
                      },
                      e.nodeId,
                    ),
                  )
            }),
            s.forEach(function (e) {
              h.push(Object(I.jsx)(hp.a, { children: e.nodeName })),
                e.paths.forEach(function (t, n) {
                  h.push(
                    Object(I.jsx)(
                      Rl.a,
                      {
                        value: ''.concat(e.nodeId, '/').concat(t.filePath),
                        onClick: function () {
                          return b(e.nodeId, t.filePath, t.type, t.outputKey)
                        },
                        children: t.outputKey,
                      },
                      ''.concat(e.nodeId, '/').concat(t.filePath),
                    ),
                  )
                })
            }),
            Object(I.jsxs)(Hf.a, {
              style: { minWidth: 150, maxWidth: 220 },
              variant: 'standard',
              children: [
                Object(I.jsx)(Uf.a, { children: c || 'Select Item' }),
                Object(I.jsx)(Kf.a, {
                  value: ''.concat(n, '/').concat(r),
                  open: f,
                  onClose: p,
                  onOpen: function () {
                    j(!0)
                  },
                  children: h,
                }),
                i.length + s.length === 0 &&
                  Object(I.jsx)(kj.a, { error: !0, children: 'no data' }),
              ],
            })
          )
        }
      function xp(e) {
        switch (e) {
          case Xn:
            return xn
          case Yn:
            return On
          case $n:
            return wn
          case Jn:
            return kn
          case Qn:
            return Cn
        }
      }
      var Op = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.b)(),
            r = Object(z.c)(function (e) {
              return ii(e) === t
            }),
            a = (function (e) {
              var t = Object(z.b)(),
                n = Object(z.c)(di(e)),
                r = Object(z.c)(fi(e)),
                a = u.a.useState({ width: n, height: r }),
                c = Object(N.a)(a, 2),
                i = c[0],
                o = c[1],
                s = u.a.useCallback(
                  function (n) {
                    return t(ko(Object(K.a)({ itemId: e }, n)))
                  },
                  [t, e],
                ),
                l = up(
                  function (e) {
                    var t = e.screenX,
                      n = i.width
                    return {
                      onMouseMove: function (e) {
                        var r = n + (e.screenX - t)
                        ;(n = r >= wp ? r : wp),
                          o(function (e) {
                            return Object(K.a)(
                              Object(K.a)({}, e),
                              {},
                              { width: n },
                            )
                          }),
                          (t = e.screenX)
                      },
                      onMouseUp: function () {
                        s(Object(K.a)(Object(K.a)({}, i), {}, { width: n }))
                      },
                    }
                  },
                  [i, s],
                ),
                d = up(
                  function (e) {
                    var t = e.screenY,
                      n = i.height
                    return {
                      onMouseMove: function (e) {
                        var r = n + (e.screenY - t)
                        ;(n = r >= Ip ? r : Ip),
                          o(function (e) {
                            return Object(K.a)(
                              Object(K.a)({}, e),
                              {},
                              { height: n },
                            )
                          }),
                          (t = e.screenY)
                      },
                      onMouseUp: function () {
                        s(Object(K.a)(Object(K.a)({}, i), {}, { height: n }))
                      },
                    }
                  },
                  [i, s],
                ),
                f = up(
                  function (e) {
                    var t = e.screenX,
                      n = i.width,
                      r = e.screenY,
                      a = i.height
                    return {
                      onMouseMove: function (e) {
                        var c = n + (e.screenX - t)
                        n = c >= wp ? c : wp
                        var i = a + (e.screenY - r)
                        o({ width: n, height: (a = i >= Ip ? i : Ip) }),
                          (t = e.screenX),
                          (r = e.screenY)
                      },
                      onMouseUp: function () {
                        s({ width: n, height: a })
                      },
                    }
                  },
                  [i, s],
                )
              return {
                size: i,
                onMouseDownX: l,
                onMouseDownY: d,
                onMouseDownXY: f,
              }
            })(t),
            c = a.size,
            i = a.onMouseDownX,
            o = a.onMouseDownY,
            s = a.onMouseDownXY
          return Object(I.jsxs)(m.a, {
            sx: { m: 1, display: 'flex', flexDirection: 'row' },
            children: [
              Object(I.jsxs)(m.a, {
                sx: { display: 'flex', flexDirection: 'column' },
                children: [
                  Object(I.jsxs)(
                    ia.a,
                    {
                      variant: 'outlined',
                      onClick: function () {
                        n(Co(t))
                      },
                      sx: {
                        width: ''.concat(c.width, 'px'),
                        minHeight: ''.concat(c.height, 'px'),
                        p: 1,
                        borderColor: function (e) {
                          return r ? e.palette.primary.light : void 0
                        },
                      },
                      children: [
                        Object(I.jsx)(vp, { itemId: t }),
                        Object(I.jsx)(ij, { itemId: t }),
                      ],
                    },
                    t,
                  ),
                  Object(I.jsxs)(m.a, {
                    sx: { display: 'flex' },
                    children: [
                      Object(I.jsx)(m.a, {
                        sx: {
                          flexGrow: 1,
                          position: 'relative',
                          top: '-2px',
                          height: '4px',
                          cursor: 'row-resize',
                        },
                        onMouseDown: o,
                      }),
                      Object(I.jsx)(m.a, {
                        sx: {
                          position: 'relative',
                          top: '-2px',
                          height: '4px',
                          width: '12px',
                          cursor: 'nwse-resize',
                        },
                        onMouseDown: s,
                      }),
                    ],
                  }),
                ],
              }),
              Object(I.jsxs)(m.a, {
                sx: { display: 'flex', flexDirection: 'column' },
                children: [
                  Object(I.jsx)(m.a, {
                    sx: {
                      flexGrow: 1,
                      position: 'relative',
                      left: '-2px',
                      width: '4px',
                      cursor: 'col-resize',
                    },
                    onMouseDown: i,
                  }),
                  Object(I.jsx)(m.a, {
                    sx: {
                      position: 'relative',
                      height: '12px',
                      width: '4px',
                      left: '-2px',
                      cursor: 'nwse-resize',
                    },
                    onMouseDown: s,
                  }),
                ],
              }),
            ],
          })
        }),
        vp = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.c)(ji(t))
          return Object(I.jsxs)(m.a, {
            display: 'flex',
            justifyContent: 'flex-end',
            children: [
              Object(I.jsxs)(m.a, {
                flexGrow: 1,
                children: [
                  Object(I.jsxs)(I.Fragment, { children: ['ID: ', t] }),
                  Object(I.jsx)(gp, { itemId: t }),
                ],
              }),
              n === hn &&
                Object(I.jsx)(m.a, {
                  flexGrow: 1,
                  children: Object(I.jsx)(yp, { itemId: t }),
                }),
              n === xn &&
                Object(I.jsx)(m.a, {
                  flexGrow: 1,
                  children: Object(I.jsx)(kp, { itemId: t }),
                }),
              Object(I.jsx)(m.a, {
                children: Object(I.jsx)(pp, { itemId: t }),
              }),
            ],
          })
        }),
        gp = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.b)(),
            r = Object(z.c)(ji(t)),
            a = Object(z.c)(pi(t)),
            c = Object(z.c)(xi(t)),
            i = Object(z.c)(Xi(t))
          return Object(I.jsx)(mp, {
            selectedNodeId: a,
            selectedFilePath: c,
            onSelect: function (e, a, o) {
              var u = { itemId: t, nodeId: e, filePath: a, dataType: o }
              n(
                eo(
                  i && null != c
                    ? Object(K.a)(
                        Object(K.a)({}, u),
                        {},
                        { deleteData: !0, prevDataType: r, prevFilePath: c },
                      )
                    : Object(K.a)(Object(K.a)({}, u), {}, { deleteData: !1 }),
                ),
              )
            },
          })
        }),
        yp = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.b)(),
            r = Object(z.c)(oi, La),
            a = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n = si(e)(t)
                  if (ti(n)) return n.refImageItemId
                  throw new Error('invalid VisualaizeItemType')
                }
              })(t),
            )
          return Object(I.jsxs)(Hf.a, {
            fullWidth: !0,
            variant: 'standard',
            children: [
              Object(I.jsx)(Uf.a, { children: 'ref image' }),
              Object(I.jsxs)(Kf.a, {
                value: String(a),
                onChange: function (e) {
                  var r = Number(e.target.value)
                  n(Qo({ itemId: t, refImageItemId: isNaN(r) ? null : r }))
                },
                children: [
                  Object(I.jsx)(Rl.a, { value: void 0, children: 'None' }),
                  r.map(function (e) {
                    return Object(I.jsx)(Rl.a, { value: e, children: e })
                  }),
                ],
              }),
            ],
          })
        }),
        wp = 200,
        Ip = 150
      var kp = u.a.memo(function (e) {
          var t = e.itemId,
            n = Object(z.b)(),
            r = Object(z.c)(
              (function (e) {
                return function (t) {
                  var n,
                    r,
                    a = si(e)(t)
                  if (ei(a))
                    return null !==
                      (n =
                        null === (r = a.roiItem) || void 0 === r
                          ? void 0
                          : r.nodeId) && void 0 !== n
                      ? n
                      : null
                  throw new Error('invalid VisualaizeItemType')
                }
              })(t),
            ),
            a = Object(z.c)(vi(t))
          return Object(I.jsx)(mp, {
            selectedFilePath: a,
            selectedNodeId: r,
            onSelect: function (e, r, a, c) {
              n(Po({ itemId: t, nodeId: e, filePath: r, outputKey: c }))
            },
            dataType: vn,
            label: 'Select Roi',
          })
        }),
        Cp = function () {
          var e = Object(z.c)(li, Ma)
          return Object(I.jsxs)(m.a, {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            p: 1,
            m: 1,
            children: [
              e.map(function (e) {
                return Object(I.jsx)(m.a, {
                  display: 'flex',
                  flexDirection: 'row',
                  children: e.map(function (e) {
                    return Object(I.jsx)(Op, { itemId: e }, e)
                  }),
                })
              }),
              Object(I.jsx)(cp, {}),
            ],
          })
        },
        Sp = (n(807), n(861)),
        _p = n(874),
        Pp = u.a.memo(function (e) {
          var t = e.colors,
            n = e.dispatchSetColor,
            r = t.map(function (e) {
              return { offset: e.offset, color: e.rgb }
            }),
            a = Object(o.useState)(!1),
            c = Object(N.a)(a, 2),
            i = c[0],
            u = c[1]
          return Object(I.jsx)(Sp.GradientPickerPopover, {
            open: i,
            setOpen: function () {
              return u(!i)
            },
            width: 150,
            maxStops: 10,
            paletteHeight: 25,
            palette: r,
            onPaletteChange: function (e) {
              var t = e.map(function (e) {
                var t = e.color.replace(/[^0-9,]/g, '').split(','),
                  n = { r: Number(t[0]), g: Number(t[1]), b: Number(t[2]) }
                return {
                  rgb: 'rgb('
                    .concat(n.r, ', ')
                    .concat(n.g, ', ')
                    .concat(n.b, ')'),
                  offset: e.offset,
                }
              })
              n(t)
            },
            flatStyle: !0,
            children: Object(I.jsx)(Tp, {}),
          })
        }),
        Tp = function (e) {
          var t = e.onSelect,
            n = e.color
          return Object(I.jsx)(_p.a, {
            color: n,
            width: '150px',
            onChange: function (e) {
              var n = e.rgb,
                r = n.r,
                a = n.g,
                c = n.b,
                i = n.a
              null === t ||
                void 0 === t ||
                t('rgb('.concat(r, ', ').concat(a, ', ').concat(c, ')'), i)
            },
          })
        },
        Ep = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(hi(e)),
            n = Object(z.c)(mi(e)),
            r = Object(z.b)()
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)('h3', { children: 'SaveFig' }),
              Object(I.jsxs)(Hf.a, {
                variant: 'standard',
                sx: { minWidth: 120, width: '100%', marginBottom: 1 },
                children: [
                  Object(I.jsx)(Uf.a, { children: 'format' }),
                  Object(I.jsxs)(Kf.a, {
                    label: 'smooth',
                    value: n,
                    onChange: function (t) {
                      r(So({ itemId: e, saveFormat: t.target.value }))
                    },
                    children: [
                      Object(I.jsx)(Rl.a, { value: 'svg', children: 'svg' }),
                      Object(I.jsx)(Rl.a, { value: 'png', children: 'png' }),
                      Object(I.jsx)(Rl.a, { value: 'jpeg', children: 'jpeg' }),
                      Object(I.jsx)(Rl.a, { value: 'webp', children: 'webp' }),
                    ],
                  }),
                ],
              }),
              Object(I.jsx)(ll.a, {
                style: { width: '100%' },
                label: 'Filename',
                InputLabelProps: { shrink: !0 },
                onChange: function (t) {
                  r(_o({ itemId: e, saveFileName: t.target.value }))
                },
                value: t,
              }),
            ],
          })
        },
        Fp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.b)(),
            n = Object(z.c)(xi(e)),
            r = Object(z.c)(Xi(e)),
            a = ql({ fileType: Xn }).onUploadFile,
            c = Object(z.c)(_i(e))
          return Object(I.jsxs)('div', {
            style: { margin: '10px', padding: 10 },
            children: [
              Object(I.jsx)($l, {
                filePath: null !== n && void 0 !== n ? n : '',
                onSelectFile: function (a) {
                  return (
                    !Array.isArray(a) &&
                    (function (a) {
                      var c = { itemId: e, nodeId: null, filePath: a }
                      t(
                        eo(
                          r && null != n
                            ? Object(K.a)(
                                Object(K.a)({}, c),
                                {},
                                {
                                  deleteData: !0,
                                  prevDataType: xn,
                                  prevFilePath: n,
                                },
                              )
                            : Object(K.a)(
                                Object(K.a)({}, c),
                                {},
                                { deleteData: !1 },
                              ),
                        ),
                      )
                    })(a)
                  )
                },
                onUploadFile: function (e, t) {
                  a(e, t)
                },
                fileTreeType: Os,
                selectButtonLabel: 'Select Image',
              }),
              Object(I.jsx)(Wp, {}),
              Object(I.jsx)(Np, {}),
              Object(I.jsx)(Dp, {}),
              Object(I.jsx)(Rp, {}),
              Object(I.jsx)(zp, {}),
              Object(I.jsx)(Lp, {}),
              Object(I.jsx)(Pp, {
                colors: c,
                dispatchSetColor: function (n) {
                  t(Mo({ itemId: e, colors: n }))
                },
              }),
              Object(I.jsx)(Mp, {}),
              Object(I.jsx)(Ap, {}),
              Object(I.jsx)(Ep, {}),
            ],
          })
        },
        Np = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(gi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(No({ itemId: e, showticklabels: !t }))
              },
            }),
            label: 'Showticklabels',
          })
        },
        Dp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(ki(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Ro({ itemId: e, showline: !t }))
              },
            }),
            label: 'ShowLine',
          })
        },
        Rp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Ci(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(zo({ itemId: e, showgrid: !t }))
              },
            }),
            label: 'ShowGrid',
          })
        },
        zp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Si(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Lo({ itemId: e, showscale: !t }))
              },
            }),
            label: 'ShowScale',
          })
        },
        Lp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(yi(e)),
            n = Object(z.b)()
          return Object(I.jsxs)(Hf.a, {
            variant: 'standard',
            sx: { m: 1, minWidth: 120 },
            children: [
              Object(I.jsx)(Uf.a, { children: 'smooth' }),
              Object(I.jsxs)(Kf.a, {
                label: 'smooth',
                value: t,
                onChange: function (t) {
                  n(Do({ itemId: e, zsmooth: t.target.value }))
                },
                children: [
                  Object(I.jsx)(Rl.a, { value: 'best', children: 'best' }),
                  Object(I.jsx)(Rl.a, { value: 'fast', children: 'fast' }),
                  Object(I.jsx)(Rl.a, { value: 'false', children: 'False' }),
                ],
              }),
            ],
          })
        },
        Mp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.b)(),
            n = Object(z.c)(Pi(e)),
            r = !(n > 0)
          return Object(I.jsx)(I.Fragment, {
            children: Object(I.jsx)(ll.a, {
              style: { width: '100%' },
              label: 'image alpha',
              error: r,
              type: 'number',
              inputProps: { step: 0.1, min: 0, max: 1 },
              InputLabelProps: { shrink: !0 },
              onChange: function (n) {
                var r = '' === n.target.value ? '' : Number(n.target.value)
                'number' === typeof r && t(Bo({ itemId: e, alpha: r }))
              },
              value: n,
              helperText: r ? 'index > 0' : void 0,
            }),
          })
        },
        Ap = function () {
          var e = u.a.useContext(ib),
            t = Object(z.b)(),
            n = Object(z.c)(Ti(e)),
            r = !(n > 0)
          return Object(I.jsx)(I.Fragment, {
            children: Object(I.jsx)(ll.a, {
              style: { width: '100%' },
              label: 'roi alpha',
              error: r,
              type: 'number',
              inputProps: { step: 0.1, min: 0, max: 1 },
              InputLabelProps: { shrink: !0 },
              onChange: function (n) {
                var r = '' === n.target.value ? '' : Number(n.target.value)
                'number' === typeof r && t(Vo({ itemId: e, roiAlpha: r }))
              },
              value: n,
              helperText: r ? 'index > 0' : void 0,
            }),
          })
        },
        Wp = function () {
          var e = u.a.useContext(ib),
            t = u.a.useState(Object(z.c)(wi(e))),
            n = Object(N.a)(t, 2),
            r = n[0],
            a = n[1],
            c = u.a.useState(Object(z.c)(Ii(e))),
            i = Object(N.a)(c, 2),
            o = i[0],
            s = i[1],
            l = !(r > 0),
            d = Object(z.b)(),
            f = Object(z.c)(xi(e))
          return Object(I.jsxs)(m.a, {
            sx: { display: 'flex', alignItems: 'flex-start' },
            children: [
              Object(I.jsx)(ll.a, {
                error: l,
                type: 'number',
                inputProps: { step: 1, min: 0 },
                InputLabelProps: { shrink: !0 },
                onChange: function (e) {
                  var t = '' === e.target.value ? '' : Number(e.target.value)
                  'number' === typeof t && a(t)
                },
                value: r,
                helperText: l ? 'index > 0' : void 0,
              }),
              '~',
              Object(I.jsx)(ll.a, {
                type: 'number',
                InputLabelProps: { shrink: !0 },
                onChange: function (e) {
                  var t = '' === e.target.value ? '' : Number(e.target.value)
                  'number' === typeof t && s(t)
                },
                value: o,
              }),
              Object(I.jsx)(G.a, {
                size: 'small',
                className: 'ctrl_btn',
                variant: 'contained',
                onClick: function () {
                  r > 0 &&
                    (d(Ao({ itemId: e, startIndex: r })),
                    d(Wo({ itemId: e, endIndex: o })),
                    d(To({ itemId: e, startIndex: r, endIndex: o })),
                    null !== f &&
                      d(
                        _c({
                          path: f,
                          startIndex: null !== r && void 0 !== r ? r : 1,
                          endIndex: null !== o && void 0 !== o ? o : 10,
                        }),
                      ))
                },
                children: 'load',
              }),
            ],
          })
        },
        Bp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(bi(e)),
            n = Object(z.b)(),
            r = Object(z.c)(Xi(e)),
            a = ql({ fileType: Yn }).onUploadFile
          return Object(I.jsxs)('div', {
            style: { margin: '10px', padding: 10 },
            children: [
              Object(I.jsx)($l, {
                filePath: null !== t && void 0 !== t ? t : '',
                onSelectFile: function (a) {
                  return (
                    !Array.isArray(a) &&
                    (function (a) {
                      var c = { itemId: e, nodeId: null, filePath: a }
                      n(
                        eo(
                          r && null != t
                            ? Object(K.a)(
                                Object(K.a)({}, c),
                                {},
                                {
                                  deleteData: !0,
                                  prevDataType: On,
                                  prevFilePath: t,
                                },
                              )
                            : Object(K.a)(
                                Object(K.a)({}, c),
                                {},
                                { deleteData: !1 },
                              ),
                        ),
                      )
                    })(a)
                  )
                },
                onUploadFile: function (e, t) {
                  a(e, t)
                },
                fileTreeType: vs,
                selectButtonLabel: 'Select CSV',
              }),
              Object(I.jsx)(Vp, {}),
              Object(I.jsx)(Up, {}),
              Object(I.jsx)(Hp, {}),
            ],
          })
        },
        Vp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Hi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(nu({ itemId: e, transpose: !t }))
              },
            }),
            label: 'transpose',
          })
        },
        Up = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Ki(e)),
            n = Object(z.b)()
          return Object(I.jsx)(I.Fragment, {
            children: Object(I.jsx)(ll.a, {
              label: 'header',
              sx: {
                width: 100,
                margin: function (e) {
                  return e.spacing(0, 1, 0, 1)
                },
              },
              type: 'number',
              InputLabelProps: { shrink: !0 },
              onChange: function (t) {
                var r = '' === t.target.value ? null : Number(t.target.value)
                ;(null === r || r >= 0) && n(ru({ itemId: e, setHeader: r }))
              },
              value: t,
            }),
          })
        },
        Hp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Zi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(au({ itemId: e, setIndex: !t }))
              },
            }),
            label: 'setIndex',
          })
        },
        Kp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.b)(),
            n = Object(z.c)(Ui(e))
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(Zp, {}),
              Object(I.jsx)(Pp, {
                colors: n,
                dispatchSetColor: function (n) {
                  t(tu({ itemId: e, colors: n }))
                },
              }),
              Object(I.jsx)(Ep, {}),
            ],
          })
        },
        Zp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Vi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(eu({ itemId: e, showscale: !t }))
              },
            }),
            label: 'showscale',
          })
        },
        Gp = function () {
          return Object(I.jsxs)('div', {
            style: { margin: '10px', padding: 10 },
            children: [
              Object(I.jsx)(qp, {}),
              Object(I.jsx)(Yp, {}),
              Object(I.jsx)(Xp, {}),
              Object(I.jsx)($p, {}),
              Object(I.jsx)(Jp, {}),
              Object(I.jsx)(Qp, {}),
              Object(I.jsx)(eb, {}),
              Object(I.jsx)(tb, {}),
              Object(I.jsx)(Ep, {}),
            ],
          })
        },
        qp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Ei(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Ho({ itemId: e, offset: !t }))
              },
            }),
            label: 'offset',
          })
        },
        Yp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Fi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(ll.a, {
              type: 'number',
              style: { width: '6vw' },
              InputLabelProps: { shrink: !0 },
              onChange: function (t) {
                var r = '' === t.target.value ? '' : Number(t.target.value)
                'number' === typeof r && r > 0 && n(Ko({ itemId: e, span: r }))
              },
              defaultValue: t,
            }),
            label: 'offset std',
          })
        },
        Xp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Ni(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Zo({ itemId: e, showgrid: !t }))
              },
            }),
            label: 'showgrid',
          })
        },
        $p = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Di(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Go({ itemId: e, showline: !t }))
              },
            }),
            label: 'showline',
          })
        },
        Jp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Ri(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(qo({ itemId: e, showticklabels: !t }))
              },
            }),
            label: 'showticklabels',
          })
        },
        Qp = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(zi(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsx)(sl.a, {
              checked: t,
              onChange: function () {
                n(Yo({ itemId: e, zeroline: !t }))
              },
            }),
            label: 'zeroline',
          })
        },
        eb = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(Li(e)),
            n = Object(z.b)()
          return Object(I.jsx)(gd.a, {
            control: Object(I.jsxs)(I.Fragment, {
              children: [
                Object(I.jsx)(ll.a, {
                  label: 'left',
                  style: { width: 50 },
                  type: 'number',
                  inputProps: { step: 1, min: 0 },
                  InputLabelProps: { shrink: !0 },
                  onChange: function (t) {
                    var r = '' === t.target.value ? '' : Number(t.target.value)
                    'number' === typeof r && n(Xo({ itemId: e, left: r }))
                  },
                  defaultValue: t.left,
                }),
                Object(I.jsx)(ll.a, {
                  label: 'right',
                  style: { width: 50 },
                  type: 'number',
                  InputLabelProps: { shrink: !0 },
                  onChange: function (t) {
                    var r = '' === t.target.value ? '' : Number(t.target.value)
                    'number' === typeof r && n($o({ itemId: e, right: r }))
                  },
                  defaultValue: t.right,
                }),
              ],
            }),
            label: '',
          })
        },
        tb = function () {
          var e = u.a.useContext(ib),
            t = Object(z.b)(),
            n = Object(z.c)(Wi(e), La),
            r = Object(z.c)(Mi(e), La),
            a = Object(z.c)(Oi(e)),
            c = function (n) {
              var c = n.target.value,
                i = n.target.checked
                  ? [].concat(Object(Yr.a)(r), [c])
                  : r.filter(function (e) {
                      return e !== c
                    })
              t(Jo({ itemId: e, drawOrderList: i })),
                null !== a && t(kc({ path: a, index: c }))
            },
            i = Object.fromEntries(
              n.map(function (e) {
                return r.includes(e) ? [e, !0] : [e, !1]
              }),
            ),
            o = Object(I.jsx)(m.a, {
              sx: { display: 'flex', flexDirection: 'column', ml: 3 },
              children: n.map(function (e) {
                return Object(I.jsx)(
                  gd.a,
                  {
                    label: 'Index '.concat(e),
                    control: Object(I.jsx)(ba.a, {
                      checked: i[e],
                      onChange: c,
                      value: e,
                    }),
                  },
                  ''.concat(e),
                )
              }),
            })
          return Object(I.jsxs)(pl, {
            sx: { mt: 2 },
            TransitionProps: { unmountOnExit: !0 },
            children: [
              Object(I.jsx)(fl.a, {
                expandIcon: Object(I.jsx)(Pu.a, {}),
                children: 'Legend select',
              }),
              Object(I.jsx)(dl.a, {
                children: Object(I.jsxs)(I.Fragment, {
                  children: [
                    Object(I.jsx)(gd.a, {
                      label: 'All Check',
                      control: Object(I.jsx)(ba.a, {
                        checked: Object.values(i).every(function (e) {
                          return e
                        }),
                        onChange: function (r) {
                          t(
                            Jo({
                              itemId: e,
                              drawOrderList: r.target.checked ? n : [],
                            }),
                          ),
                            r.target.checked && null !== a && t(Cc({ path: a }))
                        },
                      }),
                    }),
                    o,
                  ],
                }),
              }),
            ],
          })
        },
        nb = function () {
          return Object(I.jsx)(I.Fragment, {})
        },
        rb = function () {
          return Object(I.jsx)('div', {
            style: { margin: '10px', padding: 10 },
            children: Object(I.jsx)(Ep, {}),
          })
        },
        ab = function () {
          return Object(I.jsx)('div', {
            style: { margin: '10px', padding: 10 },
            children: Object(I.jsx)(Ep, {}),
          })
        },
        cb = function () {
          var e = Object(z.c)(ii)
          return Object(I.jsx)(I.Fragment, {
            children:
              null != e
                ? Object(I.jsx)(ib.Provider, {
                    value: e,
                    children: Object(I.jsx)(m.a, {
                      m: 1,
                      children: Object(I.jsx)(ob, {}),
                    }),
                  })
                : 'Please select item...',
          })
        },
        ib = u.a.createContext(NaN),
        ob = function () {
          var e = u.a.useContext(ib),
            t = Object(z.c)(ji(e))
          return Object(I.jsx)('div', {
            style: { marginTop: 8 },
            children: Object(I.jsx)(ub, { dataType: t }),
          })
        },
        ub = function (e) {
          switch (e.dataType) {
            case xn:
              return Object(I.jsx)(Fp, {})
            case On:
              return Object(I.jsx)(Bp, {})
            case mn:
              return Object(I.jsx)(Kp, {})
            case hn:
              return Object(I.jsx)(Gp, {})
            case vn:
              return Object(I.jsx)(nb, {})
            case gn:
              return Object(I.jsx)(rb, {})
            case yn:
              return Object(I.jsx)(ab, {})
            case In:
              return Object(I.jsx)('div', { children: 'html editor' })
            default:
              return null
          }
        },
        sb = Object(x.a)('div')({ display: 'flex' }),
        lb = Object(x.a)('div')({ overflow: 'auto' }),
        db = Object(x.a)('main')({
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100vh',
        }),
        fb = function () {
          return Object(I.jsxs)(sb, {
            children: [
              Object(I.jsxs)(m.a, {
                sx: { width: 240 },
                borderRight: 1,
                borderColor: Qj.a[300],
                children: [
                  Object(I.jsx)(Yj, {}),
                  Object(I.jsx)(lb, { children: Object(I.jsx)(cb, {}) }),
                ],
              }),
              Object(I.jsx)(db, { children: Object(I.jsx)(Cp, {}) }),
            ],
          })
        },
        jb = Object(Re.d)({
          name: 'workspace',
          initialState: {
            workspaces: [{ workspace_id: 'default' }],
            currentWorkspace: { selectedTab: 0 },
            loading: !1,
          },
          reducers: {
            setActiveTab: function (e, t) {
              e.currentWorkspace.selectedTab = t.payload
            },
            setCurrentWorkspace: function (e, t) {
              e.currentWorkspace.workspaceId = t.payload
            },
            clearCurrentWorkspace: function (e) {
              e.currentWorkspace = { selectedTab: 0 }
            },
          },
          extraReducers: function (e) {
            e.addCase(Br.fulfilled, function (e, t) {
              e.currentWorkspace.workspaceId = t.meta.arg.workspaceId
            })
          },
        }),
        pb = jb.actions,
        bb = pb.setCurrentWorkspace,
        hb = pb.clearCurrentWorkspace,
        mb = pb.setActiveTab,
        xb = jb.reducer,
        Ob = ['children', 'value', 'index'],
        vb = Object(x.a)('div')(function (e) {
          return {
            flexGrow: 1,
            backgroundColor: e.theme.palette.background.paper,
            height: '100%',
          }
        })
      function gb(e) {
        var t = e.children,
          n = e.value,
          r = e.index,
          a = Object($.a)(e, Ob)
        return Object(I.jsx)(
          'div',
          Object(K.a)(
            Object(K.a)(
              {
                style: { height: 'calc(100% - 58px)' },
                role: 'tabpanel',
                hidden: n !== r,
                id: 'simple-tabpanel-'.concat(r),
                'aria-labelledby': 'simple-tab-'.concat(r),
              },
              a,
            ),
            {},
            {
              children:
                n === r &&
                Object(I.jsx)(m.a, { sx: { height: '100%' }, children: t }),
            },
          ),
        )
      }
      var yb = function () {
          var e = Object(z.b)(),
            t = (function () {
              var e = Object(z.b)(),
                t = Object(z.c)(Nn),
                n = Object(z.c)(An),
                r = Object(z.c)(Wn),
                a = Object(z.c)(or),
                c = Object(z.c)(Mt),
                i = Object(z.c)(lr),
                o = u.a.useCallback(
                  function (t) {
                    e(
                      vr({
                        runPostData: Object(K.a)(
                          Object(K.a)({ name: t }, i),
                          {},
                          { forceRunList: [] },
                        ),
                      }),
                    )
                  },
                  [e, i],
                ),
                s = u.a.useCallback(
                  function () {
                    e(gr({ runPostData: i }))
                  },
                  [e, i],
                ),
                l = u.a.useCallback(
                  function () {
                    null != t && e(Kr())
                  },
                  [e, t],
                )
              u.a.useEffect(
                function () {
                  var a = setInterval(function () {
                    r && !n && null != t && e(yr({ uid: t }))
                  }, 5e3)
                  return function () {
                    clearInterval(a)
                  }
                },
                [e, t, n, r],
              )
              var d = Object(z.c)(Mn),
                f = Object(p.b)().enqueueSnackbar,
                j = u.a.useState(d),
                b = Object(N.a)(j, 2),
                h = b[0],
                m = b[1]
              return (
                u.a.useEffect(
                  function () {
                    h !== d &&
                      (d === on
                        ? (f('Finished', { variant: 'success' }), e(Mr()))
                        : d === cn
                        ? e(Mr())
                        : d === un
                        ? (f('Aborted', { variant: 'error' }), e(Mr()))
                        : d === sn &&
                          (f('Canceled', { variant: 'info' }), e(Mr())),
                      m(d))
                  },
                  [e, d, h, f],
                ),
                {
                  filePathIsUndefined: a,
                  algorithmNodeNotExist: c,
                  uid: t,
                  status: d,
                  isStartedSuccess: r,
                  handleRunPipeline: o,
                  handleRunPipelineByUid: s,
                  handleCancelPipeline: l,
                }
              )
            })(),
            n = Object(h.p)().workspaceId
          Object(o.useEffect)(
            function () {
              return (
                n && e(bb(n)),
                function () {
                  e(hb())
                }
              )
            },
            [n, e],
          )
          var r = Object(z.c)(wt)
          return Object(I.jsxs)(vb, {
            children: [
              Object(I.jsx)(gb, {
                value: r,
                index: 0,
                children: Object(I.jsx)(ap, Object(K.a)({}, t)),
              }),
              Object(I.jsx)(gb, {
                value: r,
                index: 1,
                children: Object(I.jsx)(fb, {}),
              }),
              Object(I.jsx)(gb, {
                value: r,
                index: 2,
                children: Object(I.jsx)(yu, {}),
              }),
            ],
          })
        },
        wb = n(1800),
        Ib = n(870),
        kb = n.n(Ib)
      n.p, n(866), n(867)
      function Cb(e) {
        return {
          id: 'simple-tab-'.concat(e),
          'aria-controls': 'simple-tabpanel-'.concat(e),
        }
      }
      var Sb = function () {
          var e = Object(z.b)(),
            t = Object(z.c)(wt)
          return Object(I.jsxs)(sf.a, {
            sx: { width: '100%' },
            value: t,
            onChange: function (t, n) {
              e(mb(n))
            },
            centered: !0,
            textColor: 'primary',
            children: [
              Object(I.jsx)(df.a, Object(K.a)({ label: 'Workflow' }, Cb(0))),
              Object(I.jsx)(df.a, Object(K.a)({ label: 'Visualize' }, Cb(1))),
              Object(I.jsx)(df.a, Object(K.a)({ label: 'Record' }, Cb(2))),
            ],
          })
        },
        _b = n(868),
        Pb = n.n(_b),
        Tb = n(869),
        Eb = n.n(Tb),
        Fb = { currentUser: void 0 },
        Nb = Object(Re.d)({
          name: ze,
          initialState: Fb,
          reducers: {
            logout: function (e) {
              ge(), ye()
            },
          },
          extraReducers: function (e) {
            e.addCase(Le.fulfilled, function (e, t) {
              var n, r
              ve(t.payload.access_token),
                (n = t.payload.refresh_token),
                localStorage.setItem('refresh_token', n),
                (r = t.payload.ex_token),
                localStorage.setItem('ExToken', r)
            })
              .addCase(Me.fulfilled, function (e, t) {
                e.currentUser = t.payload
              })
              .addCase(Ae.fulfilled, function (e, t) {
                e.currentUser = t.payload
              })
              .addMatcher(
                Object(Re.e)(Le.rejected, Me.rejected, We.fulfilled),
                function (e) {
                  ge(), ye()
                },
              )
          },
        }),
        Db = Nb.actions.logout,
        Rb = Nb.reducer,
        zb = function () {
          var e = Object(o.useState)(null),
            t = Object(N.a)(e, 2),
            n = t[0],
            r = t[1],
            a = Object(h.n)(),
            c = Object(z.b)()
          return Object(I.jsxs)(I.Fragment, {
            children: [
              Object(I.jsx)(d.a, {
                color: 'inherit',
                'aria-label': 'open profile menu',
                'aria-haspopup': 'true',
                onClick: function (e) {
                  r(e.currentTarget)
                },
                children: Object(I.jsx)(w.a, {}),
              }),
              Object(I.jsxs)(sp.a, {
                id: 'profile-menu',
                anchorEl: n,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                keepMounted: !0,
                transformOrigin: { vertical: 'top', horizontal: 'right' },
                open: Boolean(n),
                onClose: function () {
                  r(null)
                },
                children: [
                  Object(I.jsxs)(Rl.a, {
                    onClick: function () {
                      r(null), a('/account')
                    },
                    children: [Object(I.jsx)(Pb.a, {}), ' Account Profile'],
                  }),
                  Object(I.jsxs)(Rl.a, {
                    onClick: function () {
                      r(null), c(Db()), a('/login')
                    },
                    children: [Object(I.jsx)(Eb.a, {}), 'SIGN OUT'],
                  }),
                ],
              }),
            ],
          })
        },
        Lb = function (e) {
          var t = e.handleDrawerOpen,
            n = Object(h.l)()
          return Object(I.jsx)(Mb, {
            children: Object(I.jsxs)(Tj.a, {
              children: [
                Object(I.jsx)(d.a, {
                  color: 'inherit',
                  'aria-label': 'open drawer',
                  onClick: t,
                  edge: 'start',
                  children: Object(I.jsx)(kb.a, {}),
                }),
                Object(I.jsx)(m.a, {
                  display: 'flex',
                  flexGrow: 1,
                  children: Object(I.jsx)(Ab, { children: 'STUDIO' }),
                }),
                /^\/workspaces\/.+$/.test(n.pathname) && Object(I.jsx)(Sb, {}),
                Object(I.jsx)(zb, {}),
              ],
            }),
          })
        },
        Mb = Object(x.a)(wb.a)({
          position: 'fixed',
          backgroundColor: '#E1DEDB',
          color: '#000000',
        }),
        Ab = Object(x.a)(O.a)({ fontWeight: 600, fontSize: 22 }),
        Wb = function (e) {
          var t = e.handleDrawerOpen
          return Object(I.jsx)(Lb, { handleDrawerOpen: t })
        },
        Bb = n(1782),
        Vb = n(1772),
        Ub = n(1764),
        Hb = n(871),
        Kb = n.n(Hb),
        Zb = n(872),
        Gb = n.n(Zb),
        qb = function (e) {
          var t = e.open,
            n = e.handleDrawerClose,
            r = Object(h.n)()
          return Object(I.jsx)(I.Fragment, {
            children: Object(I.jsx)(_j.a, {
              anchor: 'left',
              open: t,
              onClose: n,
              children: Object(I.jsx)(m.a, {
                sx: { width: 240 },
                children: Object(I.jsxs)(Bb.a, {
                  children: [
                    Object(I.jsx)(
                      Vb.a,
                      {
                        disablePadding: !0,
                        children: Object(I.jsxs)(Ub.a, {
                          onClick: function () {
                            n(), r('/')
                          },
                          children: [
                            Object(I.jsx)(dp.a, {
                              children: Object(I.jsx)(Kb.a, {}),
                            }),
                            Object(I.jsx)(lp.a, { primary: 'Dashboard' }),
                          ],
                        }),
                      },
                      'dashboard',
                    ),
                    Object(I.jsx)(
                      Vb.a,
                      {
                        disablePadding: !0,
                        children: Object(I.jsxs)(Ub.a, {
                          onClick: function () {
                            n(), r('/workspaces')
                          },
                          children: [
                            Object(I.jsx)(dp.a, {
                              children: Object(I.jsx)(Gb.a, {}),
                            }),
                            Object(I.jsx)(lp.a, { primary: 'Workspaces' }),
                          ],
                        }),
                      },
                      'workspaces',
                    ),
                  ],
                }),
              }),
            }),
          })
        },
        Yb = ['/login', '/account-delete', '/reset-password'],
        Xb = Object(x.a)(m.a)({ height: '100%', width: '100%' }),
        $b = Object(x.a)(m.a)(function () {
          return {
            backgroundColor: '#ffffff',
            display: 'flex',
            paddingTop: 48,
            height: 'calc(100% - 48px)',
            paddingRight: 10,
            overflow: 'hidden',
          }
        }),
        Jb = Object(x.a)('main', {
          shouldForwardProp: function (e) {
            return 'open' !== e
          },
        })(function (e) {
          var t = e.theme,
            n = e.open
          return Object(K.a)(
            {
              flexGrow: 1,
              padding: t.spacing(3),
              transition: t.transitions.create('margin', {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.leavingScreen,
              }),
            },
            n && {
              transition: t.transitions.create('margin', {
                easing: t.transitions.easing.easeOut,
                duration: t.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
            },
          )
        }),
        Qb = function (e) {
          var t = e.children,
            n = Object(z.c)(Be),
            r = Object(h.l)(),
            a = Object(o.useState)(!1),
            c = Object(N.a)(a, 2),
            i = c[0],
            u = c[1]
          Object(o.useEffect)(
            function () {
              s()
            },
            [r.pathname, n],
          )
          var s = (function () {
            var e = Object(F.a)(
              R.a.mark(function e() {
                return R.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                      case 'end':
                        return e.stop()
                    }
                }, e)
              }),
            )
            return function () {
              return e.apply(this, arguments)
            }
          })()
          return Object(I.jsxs)(Xb, {
            children: [
              Yb.includes(r.pathname)
                ? null
                : Object(I.jsx)(Wb, {
                    handleDrawerOpen: function () {
                      u(!0)
                    },
                  }),
              Object(I.jsxs)($b, {
                children: [
                  Yb.includes(r.pathname)
                    ? null
                    : Object(I.jsx)(qb, {
                        open: i,
                        handleDrawerClose: function () {
                          u(!1)
                        },
                      }),
                  Object(I.jsx)(Jb, { open: i, children: t }),
                ],
              }),
            ],
          })
        },
        eh = function (e) {
          var t = e.data
          return t
            ? Object(I.jsx)(o.Fragment, {
                children: Object(I.jsx)('img', {
                  src: 'string' === typeof t ? t : t[0],
                  alt: '',
                  width: 100,
                }),
              })
            : null
        },
        th = Object(x.a)(m.a)(function (e) {
          e.theme
          return {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }),
        nh = Object(x.a)(m.a)(function (e) {
          e.theme
          return {
            position: 'relative',
            display: 'flex',
            background: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            height: '80%',
            border: '1px solid #000',
          }
        }),
        rh = Object(x.a)(m.a)(function (e) {
          e.theme
          return {
            overflow: 'scroll',
            position: 'relative',
            flexWrap: 'wrap',
            display: 'flex',
            background: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }
        }),
        ah = Object(x.a)('button')(function (e) {
          e.theme
          return {
            border: '1px solid #000',
            position: 'absolute',
            display: 'block',
            top: -20,
            right: -20,
            width: 40,
            height: 40,
            cursor: 'pointer',
            borderRadius: 50,
            '&:hover': { background: '#8f8a8a' },
          }
        }),
        ch = function (e) {
          var t = e.data,
            n = e.handleCloseDialog,
            r = e.open
          return t
            ? Object(I.jsx)(I.Fragment, {
                children: r
                  ? Object(I.jsx)(th, {
                      children: Object(I.jsxs)(nh, {
                        children: [
                          Object(I.jsx)(rh, {
                            children: Object(I.jsx)(m.a, {
                              sx: {
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                                margin: '80px 50px',
                              },
                              children: Array.isArray(t)
                                ? t.filter(Boolean).map(function (e, t) {
                                    return Object(I.jsx)(
                                      'img',
                                      {
                                        src: e,
                                        alt: '',
                                        width: 150,
                                        height: 150,
                                      },
                                      t,
                                    )
                                  })
                                : null,
                            }),
                          }),
                          Object(I.jsx)(ah, {
                            onClick: n,
                            children: Object(I.jsx)(j.a, {}),
                          }),
                        ],
                      }),
                    })
                  : null,
              })
            : Object(I.jsx)(I.Fragment, {})
        },
        ih = n(873),
        oh = n.n(ih),
        uh = n(1801),
        sh = [
          { label: 'Experiment ID', minWidth: 70, key: 'experiment_id' },
          { label: 'Brain area', minWidth: 70, key: 'fields.brain_area' },
          { label: 'Cre driver', minWidth: 70, key: 'fields.cre_driver' },
          { label: 'Reporter line', minWidth: 70, key: 'fields.reporter_line' },
          {
            label: 'Imaging depth',
            minWidth: 70,
            key: 'fields.imaging_depth',
            cursor: function (e) {
              return e && e.length > 1 ? 'pointer' : 'default'
            },
          },
          {
            label: 'Attributes',
            minWidth: 70,
            key: 'attributes',
            cursor: 'pointer',
          },
          { label: 'Cells', minWidth: 70, key: 'cells' },
          {
            label: 'Pixel Image',
            minWidth: 70,
            key: 'cell_image_urls',
            type: 'image',
          },
        ],
        lh = ['Plot1', 'Plot2', 'Plot3', 'Plot4', 'Plot5'],
        dh = [
          {
            id: 0,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{13}',
            cell_image_urls: [
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
            ],
            graph_urls: ['/static/pie_chart.png'],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 1,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 2,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [
              '/static/pie_chart.png',
              '/static/bar_chart.png',
              '/static/bar_chart.png',
            ],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 3,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 4,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{13}',
            cell_image_urls: [
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
            ],
            graph_urls: ['/static/pie_chart.png'],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 5,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 6,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [
              '/static/pie_chart.png',
              '/static/bar_chart.png',
              '/static/bar_chart.png',
            ],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 7,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 8,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{13}',
            cell_image_urls: [
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
            ],
            graph_urls: ['/static/pie_chart.png'],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 9,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 10,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [
              '/static/pie_chart.png',
              '/static/bar_chart.png',
              '/static/bar_chart.png',
            ],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 11,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 12,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [
              '/static/pie_chart.png',
              '/static/bar_chart.png',
              '/static/bar_chart.png',
            ],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 13,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 14,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{13}',
            cell_image_urls: [
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
              '/static/pixel_image.png',
            ],
            graph_urls: ['/static/pie_chart.png'],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 15,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 16,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [
              '/static/pie_chart.png',
              '/static/bar_chart.png',
              '/static/bar_chart.png',
              '/static/pie_chart.png',
              '/static/bar_chart.png',
            ],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
          {
            id: 17,
            experiment_id: 'xxxx',
            fields: {
              brain_area: 'xxxx',
              cre_driver: 'xxxx',
              reporter_line: 'xxxx',
              imaging_depth: 0,
            },
            attributes: '{}',
            cell_image_urls: ['/static/pixel_image.png'],
            graph_urls: [''],
            created_time: '2023-07-06T09:24:45.904Z',
            updated_time: '2023-07-06T09:24:45.904Z',
          },
        ],
        fh = function (e) {
          var t = e.data,
            n = e.open,
            r = e.handleClose
          return Object(I.jsx)(m.a, {
            children: Object(I.jsxs)(ha.a, {
              open: n,
              onClose: r,
              'aria-labelledby': 'draggable-dialog-title',
              children: [
                Object(I.jsx)(Ll.a, {
                  sx: { minWidth: 200 },
                  children: Object(I.jsx)(uh.a, { children: t }),
                }),
                Object(I.jsx)(ma.a, {
                  children: Object(I.jsx)(G.a, {
                    autoFocus: !0,
                    onClick: r,
                    children: 'Close',
                  }),
                }),
              ],
            }),
          })
        },
        jh = function (e) {
          var t = e.columns
          return Object(I.jsx)(ra.a, {
            children: Object(I.jsx)(aa.a, {
              children: t.map(function (e) {
                return Object(I.jsx)(
                  mh,
                  {
                    checkHead: e.label.toLowerCase().includes('plot'),
                    sx: { minWidth: e.minWidth },
                    children: Object(I.jsx)('span', { children: e.label }),
                  },
                  e.key,
                )
              }),
            }),
          })
        },
        ph = function (e) {
          var t = e.data,
            n = e.columns,
            r = e.handleOpenDialog,
            a = e.handleOpenAttributes,
            c = e.setTypeTable
          return Object(I.jsx)(Qr.a, {
            children: Object(I.jsx)(aa.a, {
              children: n.map(function (e) {
                var n = (function (e, t) {
                  var n = e
                  return (
                    t.includes('.')
                      ? t.split('.').forEach(function (e) {
                          var t,
                            r = isNaN(Number(e)) ? e : Number(e)
                          n = null === (t = n) || void 0 === t ? void 0 : t[r]
                        })
                      : (n = e[t]),
                    n
                  )
                })(t, e.key)
                return Object(I.jsx)(
                  ea.a,
                  {
                    children: Object(I.jsx)(m.a, {
                      onClick: function () {
                        return (function (e, t) {
                          'cell_image_urls' !== e
                            ? 'cells' !== e
                              ? 'attributes' === e && a(t)
                              : c('cells')
                            : r(t)
                        })(e.key, n)
                      },
                      sx: {
                        cursor:
                          'function' === typeof e.cursor
                            ? e.cursor(n)
                            : e.cursor,
                      },
                      children:
                        'image' === e.type
                          ? Object(I.jsx)(eh, { data: n })
                          : 'cells' === e.key
                          ? Object(I.jsx)(oh.a, {})
                          : n,
                    }),
                  },
                  e.key,
                )
              }),
            }),
          })
        },
        bh = Object(x.a)(m.a)(function (e) {
          e.theme
          return {
            width: '100%',
            height: 'calc(100vh - 165px)',
            overflow: 'scroll',
            border: '1px solid #000',
          }
        }),
        hh = Object(x.a)('table')(function (e) {
          e.theme
          return { width: '100%', height: '100%', overflow: 'scroll' }
        }),
        mh = Object(x.a)(ea.a, {
          shouldForwardProp: function (e) {
            return 'checkHead' !== e
          },
        })(function (e) {
          e.theme
          return {
            color: '#FFF',
            background: e.checkHead ? '#99dadd' : '#99dd99',
            borderLeft: '1px solid #FFF',
            fontWeight: 700,
          }
        }),
        xh = function (e) {
          var t = e.setTypeTable,
            n = Object(o.useState)(dh.slice(0, 6)),
            r = Object(N.a)(n, 2),
            a = r[0],
            c = r[1],
            i = Object(o.useState)(6),
            u = Object(N.a)(i, 2),
            s = u[0],
            l = u[1],
            d = Object(o.useState)(!1),
            f = Object(N.a)(d, 2),
            j = f[0],
            p = f[1],
            b = Object(o.useState)(!1),
            h = Object(N.a)(b, 2),
            m = h[0],
            x = h[1],
            O = Object(o.useState)(),
            v = Object(N.a)(O, 2),
            g = v[0],
            y = v[1],
            w = Object(o.useRef)(null),
            k = Object(o.useRef)(null),
            C = function (e) {
              1 !== e.length && (p(!0), y(e))
            },
            S = function (e) {
              y(e), x(!0)
            },
            _ = lh.map(function (e, t) {
              return {
                label: e,
                minWidth: 70,
                key: 'graph_urls.'.concat(t),
                type: 'image',
              }
            })
          return Object(I.jsx)(bh, {
            onScroll: function (e) {
              var t, n
              k.current &&
                w.current &&
                e.currentTarget.scrollTop +
                  (null === (t = k.current) || void 0 === t
                    ? void 0
                    : t.clientHeight) ===
                  (null === (n = w.current) || void 0 === n
                    ? void 0
                    : n.clientHeight) &&
                (l(12),
                c([].concat(Object(Yr.a)(a), Object(Yr.a)(dh.slice(s, s + 6)))))
            },
            ref: k,
            children: Object(I.jsxs)(hh, {
              ref: w,
              children: [
                Object(I.jsx)(jh, { columns: [].concat(sh, Object(Yr.a)(_)) }),
                a.map(function (e, n) {
                  return Object(I.jsx)(
                    ph,
                    {
                      setTypeTable: t,
                      handleOpenAttributes: S,
                      handleOpenDialog: C,
                      data: e,
                      columns: [].concat(sh, Object(Yr.a)(_)),
                    },
                    ''.concat(e.id, '_').concat(n),
                  )
                }),
                Object(I.jsx)(ch, {
                  open: j,
                  data: g,
                  handleCloseDialog: function () {
                    p(!1)
                  },
                }),
                Object(I.jsx)(fh, {
                  data: g,
                  open: m,
                  handleClose: function () {
                    x(!1)
                  },
                }),
              ],
            }),
          })
        },
        Oh = Object(x.a)(m.a)(function (e) {
          return { marginTop: e.theme.spacing(6) }
        }),
        vh = Object(x.a)(m.a)(function (e) {
          e.theme
          return {}
        }),
        gh = Object(x.a)('span')(function (e) {
          e.theme
          return { display: 'inline-block', cursor: 'pointer', minWidth: 100 }
        }),
        yh = Object(x.a)('span')(function (e) {
          e.theme
          return { cursor: 'pointer', marginLeft: 5 }
        }),
        wh = Object(x.a)(m.a)(function (e) {
          e.theme
          return { width: '94vw', margin: 'auto', marginTop: 15 }
        }),
        Ih = function () {
          var e = Object(o.useState)('experiments'),
            t = Object(N.a)(e, 2),
            n = t[0],
            r = t[1],
            a = function (e) {
              n !== e && r(e)
            }
          return Object(I.jsxs)(Oh, {
            children: [
              Object(I.jsxs)(vh, {
                children: [
                  Object(I.jsx)(gh, {
                    onClick: function () {
                      return a('experiments')
                    },
                    sx: { fontWeight: 'experiments' === n ? 600 : 400 },
                    children: 'Experiments',
                  }),
                  '/',
                  Object(I.jsx)(yh, {
                    onClick: function () {
                      return a('cells')
                    },
                    sx: { fontWeight: 'cells' === n ? 600 : 400 },
                    children: 'Cells',
                  }),
                ],
              }),
              Object(I.jsx)(wh, {
                children: Object(I.jsx)(xh, { setTypeTable: r }),
              }),
            ],
          })
        },
        kh = function (e) {
          var t = e.snackbarKey,
            n = Object(p.b)().closeSnackbar
          return Object(I.jsx)(d.a, {
            onClick: function () {
              return n(t)
            },
            size: 'large',
            children: Object(I.jsx)(j.a, { style: { color: 'white' } }),
          })
        },
        Ch = function () {
          return Object(I.jsx)(p.a, {
            maxSnack: 5,
            action: function (e) {
              return Object(I.jsx)(kh, { snackbarKey: e })
            },
            children: Object(I.jsx)(b.a, {
              children: Object(I.jsx)(Qb, {
                children: Object(I.jsxs)(h.c, {
                  children: [
                    Object(I.jsx)(h.a, {
                      path: '/',
                      element: Object(I.jsx)(E, {}),
                    }),
                    Object(I.jsx)(h.a, {
                      path: '/account',
                      element: Object(I.jsx)(qe, {}),
                    }),
                    Object(I.jsx)(h.a, {
                      path: '/account-deleted',
                      element: Object(I.jsx)(Ye, {}),
                    }),
                    Object(I.jsx)(h.a, {
                      path: '/login',
                      element: Object(I.jsx)(ut, {}),
                    }),
                    Object(I.jsx)(h.a, {
                      path: '/reset-password',
                      element: Object(I.jsx)(gt, {}),
                    }),
                    Object(I.jsx)(h.a, {
                      path: '/public-database',
                      element: Object(I.jsx)(Ih, {}),
                    }),
                    Object(I.jsxs)(h.a, {
                      path: '/workspaces',
                      children: [
                        Object(I.jsx)(h.a, {
                          path: '',
                          element: Object(I.jsx)(Tt, {}),
                        }),
                        Object(I.jsx)(h.a, {
                          path: ':workspaceId',
                          element: Object(I.jsx)(yb, {}),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
          })
        },
        Sh = function (e) {
          e &&
            e instanceof Function &&
            n
              .e(3)
              .then(n.bind(null, 1803))
              .then(function (t) {
                var n = t.getCLS,
                  r = t.getFID,
                  a = t.getFCP,
                  c = t.getLCP,
                  i = t.getTTFB
                n(e), r(e), a(e), c(e), i(e)
              })
        },
        _h = n(157),
        Ph = Object(Re.d)({
          name: Bu,
          initialState: { isLatest: !1, tree: {} },
          reducers: {},
          extraReducers: function (e) {
            e.addCase(Hu.fulfilled, function (e, t) {
              ;(e.tree = Lu(t.payload)), (e.isLatest = !0)
            })
          },
        }).reducer
      function Th(e, t, n) {
        n === xn
          ? delete e.image[t]
          : n === hn
          ? delete e.timeSeries[t]
          : n === On
          ? delete e.csv[t]
          : n === mn
          ? delete e.heatMap[t]
          : n === gn
          ? delete e.scatter[t]
          : n === yn
          ? delete e.bar[t]
          : n === In && delete e.html[t]
      }
      var Eh = Object(Re.d)({
          name: bn,
          initialState: {
            timeSeries: {},
            heatMap: {},
            image: {},
            csv: {},
            roi: {},
            scatter: {},
            bar: {},
            html: {},
          },
          reducers: {},
          extraReducers: function (e) {
            e.addCase(Qi, function (e, t) {
              if (t.payload.deleteData) {
                var n = t.payload
                Th(e, n.filePath, n.dataType)
              }
            })
              .addCase(eo, function (e, t) {
                if (t.payload.deleteData) {
                  var n = t.payload,
                    r = n.prevDataType
                  Th(e, n.prevFilePath, r)
                }
              })
              .addCase(kc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.timeSeries.hasOwnProperty(n)
                  ? ((e.timeSeries[n].pending = !0),
                    (e.timeSeries[n].fulfilled = !1),
                    (e.timeSeries[n].error = null))
                  : (e.timeSeries[n] = {
                      type: 'timeSeries',
                      xrange: [],
                      data: {},
                      std: {},
                      pending: !0,
                      fulfilled: !1,
                      error: null,
                    })
              })
              .addCase(kc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.timeSeries[r] = {
                  type: 'timeSeries',
                  xrange: [],
                  data: {},
                  std: {},
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(kc.fulfilled, function (e, t) {
                var n = t.meta.arg,
                  r = n.path,
                  a = n.index
                ;(e.timeSeries[r].pending = !1),
                  (e.timeSeries[r].fulfilled = !0),
                  (e.timeSeries[r].error = null),
                  (e.timeSeries[r].data[a] = t.payload.data[a]),
                  void 0 !== t.payload.std[a] &&
                    (e.timeSeries[r].std[a] = t.payload.std[a])
              })
              .addCase(Cc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.timeSeries.hasOwnProperty(n)
                  ? ((e.timeSeries[n].pending = !0),
                    (e.timeSeries[n].fulfilled = !1),
                    (e.timeSeries[n].error = null))
                  : (e.timeSeries[n] = {
                      type: 'timeSeries',
                      xrange: [],
                      data: {},
                      std: {},
                      pending: !0,
                      fulfilled: !1,
                      error: null,
                    })
              })
              .addCase(Cc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.timeSeries[r] = {
                  type: 'timeSeries',
                  xrange: [],
                  data: {},
                  std: {},
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Cc.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                ;(e.timeSeries[n].pending = !1),
                  (e.timeSeries[n].fulfilled = !0),
                  (e.timeSeries[n].error = null),
                  (e.timeSeries[n].xrange = t.payload.xrange),
                  (e.timeSeries[n].data = t.payload.data),
                  void 0 !== t.payload.std &&
                    (e.timeSeries[n].std = t.payload.std)
              })
              .addCase(Ic.pending, function (e, t) {
                var n = t.meta.arg.path
                e.timeSeries.hasOwnProperty(n)
                  ? ((e.timeSeries[n].pending = !0),
                    (e.timeSeries[n].fulfilled = !1),
                    (e.timeSeries[n].error = null))
                  : (e.timeSeries[n] = {
                      type: 'timeSeries',
                      xrange: [],
                      data: {},
                      std: {},
                      pending: !0,
                      fulfilled: !1,
                      error: null,
                    })
              })
              .addCase(Ic.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.timeSeries[r] = {
                  type: 'timeSeries',
                  xrange: [],
                  data: {},
                  std: {},
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Ic.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                ;(e.timeSeries[n].pending = !1),
                  (e.timeSeries[n].fulfilled = !0),
                  (e.timeSeries[n].error = null),
                  (e.timeSeries[n].xrange = t.payload.xrange),
                  (e.timeSeries[n].data = t.payload.data),
                  (e.timeSeries[n].std = t.payload.std)
              })
              .addCase(Sc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.heatMap[n] = {
                  type: 'heatMap',
                  data: [],
                  columns: [],
                  index: [],
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(Sc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.heatMap[r] = {
                  type: 'heatMap',
                  data: [],
                  columns: [],
                  index: [],
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Sc.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.heatMap[n] = {
                  type: 'heatMap',
                  data: t.payload.data,
                  columns: t.payload.columns,
                  index: t.payload.index,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(_c.pending, function (e, t) {
                var n = t.meta.arg.path
                e.image[n] = {
                  type: 'image',
                  data: [],
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(_c.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.image[n] = {
                  type: 'image',
                  data: t.payload.data,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(_c.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.image[r] = {
                  type: 'image',
                  data: [],
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Pc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.csv[n] = {
                  type: 'csv',
                  data: [],
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(Pc.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.csv[n] = {
                  type: 'csv',
                  data: t.payload.data,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(Pc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.csv[r] = {
                  type: 'csv',
                  data: [],
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Tc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.roi[n] = {
                  type: 'roi',
                  data: [],
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                  roiUniqueList: [],
                }
              })
              .addCase(Tc.fulfilled, function (e, t) {
                var n = t.meta.arg.path,
                  r = t.payload.data,
                  a = r[0]
                    .map(function (e) {
                      return Array.from(
                        new Set(
                          e.filter(function (e) {
                            return null != e
                          }),
                        ),
                      )
                    })
                    .flat(),
                  c = Array.from(new Set(a))
                    .sort(function (e, t) {
                      return e - t
                    })
                    .map(String)
                e.roi[n] = {
                  type: 'roi',
                  data: r,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                  roiUniqueList: c,
                }
              })
              .addCase(Tc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.roi[r] = {
                  type: 'roi',
                  data: [],
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                  roiUniqueList: [],
                }
              })
              .addCase(Ec.pending, function (e, t) {
                var n = t.meta.arg.path
                e.scatter[n] = {
                  type: 'scatter',
                  data: {},
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(Ec.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.scatter[n] = {
                  type: 'scatter',
                  data: t.payload.data,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(Ec.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.scatter[r] = {
                  type: 'scatter',
                  data: {},
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Fc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.bar[n] = {
                  type: 'bar',
                  data: {},
                  columns: [],
                  index: [],
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(Fc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.bar[r] = {
                  type: 'bar',
                  data: {},
                  columns: [],
                  index: [],
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
              .addCase(Fc.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.bar[n] = {
                  type: 'bar',
                  data: t.payload.data,
                  columns: t.payload.columns,
                  index: t.payload.index,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(Nc.pending, function (e, t) {
                var n = t.meta.arg.path
                e.html[n] = {
                  type: 'html',
                  data: '',
                  pending: !0,
                  fulfilled: !1,
                  error: null,
                }
              })
              .addCase(Nc.fulfilled, function (e, t) {
                var n = t.meta.arg.path
                e.html[n] = {
                  type: 'html',
                  data: t.payload.data,
                  pending: !1,
                  fulfilled: !0,
                  error: null,
                }
              })
              .addCase(Nc.rejected, function (e, t) {
                var n,
                  r = t.meta.arg.path
                e.html[r] = {
                  type: 'html',
                  data: '',
                  pending: !1,
                  fulfilled: !1,
                  error:
                    null !== (n = t.error.message) && void 0 !== n
                      ? n
                      : 'rejected',
                }
              })
          },
        }).reducer,
        Fh = Object(Re.d)({
          name: Ss,
          initialState: {},
          reducers: {
            setFileUploaderStateById: function (e, t) {
              e[t.payload] = Zl
            },
          },
          extraReducers: function (e) {
            e.addCase(_s, function (e, t) {
              var n = t.payload,
                r = n.progess
              e[n.requestId].uploadingProgress = r
            })
              .addCase(Ps.pending, function (e, t) {
                var n = t.meta.arg,
                  r = n.fileName,
                  a = n.requestId,
                  c = e[a]
                e[a] = Object(K.a)(
                  Object(K.a)({}, c),
                  {},
                  {
                    fileName: r,
                    isUninitialized: !1,
                    pending: !0,
                    fulfilled: !1,
                    uploadingProgress: 0,
                  },
                )
              })
              .addCase(Ps.fulfilled, function (e, t) {
                var n = t.meta.arg.requestId,
                  r = t.payload.resultPath,
                  a = e[n]
                e[n] = Object(K.a)(
                  Object(K.a)({}, a),
                  {},
                  { path: r, pending: !1, fulfilled: !0 },
                )
              })
              .addCase(Ps.rejected, function (e, t) {
                var n = t.meta.arg.requestId,
                  r = e[n]
                e[n] = Object(K.a)(
                  Object(K.a)({}, r),
                  {},
                  { pending: !1, fulfilled: !1, error: t.error.message },
                )
              })
          },
        }),
        Nh = (Fh.actions.setFileUploaderStateById, Fh.reducer),
        Dh = Object(Re.d)({
          name: pj,
          initialState: {},
          reducers: {},
          extraReducers: function (e) {
            e.addCase(bj.pending, function (e, t) {
              e[t.meta.arg] = { isLoading: !0, isLatest: !1, tree: [] }
            })
              .addCase(bj.fulfilled, function (e, t) {
                var n = t.meta.arg
                ;(e[n].tree = mj(t.payload)),
                  (e[n].isLatest = !0),
                  (e[n].isLoading = !1)
              })
              .addCase(Ps.pending, function (e, t) {
                var n = t.meta.arg.fileType
                n === Xn
                  ? null != e[Os]
                    ? (e[Os].isLatest = !1)
                    : (e[Os] = { isLoading: !1, isLatest: !1, tree: [] })
                  : n === Yn
                  ? null != e[vs]
                    ? (e[vs].isLatest = !1)
                    : (e[vs] = { isLoading: !1, isLatest: !1, tree: [] })
                  : n === $n
                  ? null != e[gs]
                    ? (e[gs].isLatest = !1)
                    : (e[gs] = { isLoading: !1, isLatest: !1, tree: [] })
                  : null != e[ys]
                  ? (e[ys].isLatest = !1)
                  : (e[ys] = { isLoading: !1, isLatest: !1, tree: [] })
              })
              .addCase(Ps.fulfilled, function (e, t) {
                var n = t.meta.arg.fileType
                n === Xn
                  ? (e[Os].isLatest = !1)
                  : n === Yn
                  ? (e[vs].isLatest = !1)
                  : n === $n
                  ? (e[gs].isLatest = !1)
                  : (e[ys].isLatest = !1)
              })
          },
        }).reducer,
        Rh = n(225),
        zh = n(1765),
        Lh = n(1766),
        Mh = n(226),
        Ah = n(264),
        Wh = {
          colorMap: {
            ImageData: Rh.a[500],
            IscellData: zh.a[500],
            TimeSeriesData: Lh.a[500],
            Suite2pData: Mh.a[500],
            FluoData: Ah.a[500],
            BehaviorData: Lh.a[500],
          },
          nextKey: 0,
        },
        Bh = Object(Re.d)({
          name: 'handleTypeColor',
          initialState: Wh,
          reducers: {},
        }).reducer
      function Vh(e) {
        return e.map(function (e) {
          return e.isDir
            ? { name: e.name, isDir: !0, nodes: Vh(e.nodes), path: e.path }
            : {
                name: e.name,
                isDir: !1,
                shape: e.shape,
                path: e.path,
                nbytes: e.nbytes,
              }
        })
      }
      var Uh = Object(Re.d)({
        name: Kd,
        initialState: { isLoading: !1, tree: [] },
        reducers: {},
        extraReducers: function (e) {
          e.addCase(Zd.pending, function (e, t) {
            ;({ isLoading: !0, tree: [] })
          }).addCase(Zd.fulfilled, function (e, t) {
            ;(e.tree = Vh(t.payload)), (e.isLoading = !1)
          })
        },
      }).reducer
      function Hh(e) {
        var t = {}
        return (
          Object.entries(e.function).forEach(function (e) {
            var n = Object(N.a)(e, 2),
              r = (n[0], n[1])
            t[r.unique_id] = {
              name: r.name,
              nodeId: r.unique_id,
              status: Kh(r.success),
              hasNWB: r.hasNWB,
            }
          }),
          {
            uid: e.unique_id,
            timestamp: e.started_at,
            status: e.success,
            name: e.name,
            hasNWB: e.hasNWB,
            functions: t,
          }
        )
      }
      function Kh(e) {
        switch (e) {
          case 'running':
            return 'running'
          case 'success':
            return 'success'
          case 'error':
            return 'error'
          default:
            throw new Error('failed to convert to EXPERIMENTS_STATUS')
        }
      }
      var Zh = Object(Re.d)({
          name: Lr,
          initialState: { status: 'uninitialized' },
          reducers: {},
          extraReducers: function (e) {
            e.addCase(Mr.pending, function () {
              return { status: 'pending' }
            })
              .addCase(Mr.fulfilled, function (e, t) {
                return {
                  status: 'fulfilled',
                  experimentList: (function (e) {
                    var t = {}
                    return (
                      Object.entries(e).forEach(function (e) {
                        var n = Object(N.a)(e, 2),
                          r = n[0],
                          a = n[1]
                        t[r] = Hh(a)
                      }),
                      t
                    )
                  })(t.payload),
                }
              })
              .addCase(Mr.rejected, function (e, t) {
                return { status: 'error', message: t.error.message }
              })
              .addCase(Ar.fulfilled, function (e, t) {
                t.payload &&
                  'fulfilled' === e.status &&
                  delete e.experimentList[t.meta.arg]
              })
              .addCase(Wr.fulfilled, function (e, t) {
                t.payload &&
                  'fulfilled' === e.status &&
                  t.meta.arg.map(function (t) {
                    return delete e.experimentList[t]
                  })
              })
              .addCase(yr.fulfilled, function (e, t) {
                if ('fulfilled' === e.status) {
                  var n = t.meta.arg.uid,
                    r = e.experimentList[n]
                  Object.entries(t.payload).forEach(function (e) {
                    var t = Object(N.a)(e, 2),
                      n = t[0],
                      a = t[1]
                    'success' === a.status
                      ? (r.functions[n].status = 'success')
                      : 'error' === a.status &&
                        (r.functions[n].status = 'error')
                  })
                }
              })
              .addMatcher(
                Object(Re.e)(vr.fulfilled, gr.fulfilled),
                function () {
                  return { status: 'uninitialized' }
                },
              )
          },
        }).reducer,
        Gh = Object(_h.b)({
          algorithmList: Ph,
          algorithmNode: Aj,
          displayData: Eh,
          fileUploader: Nh,
          flowElement: Vs,
          inputNode: Sd,
          handleColor: Bh,
          filesTree: Dh,
          nwb: Xs,
          rightDrawer: ul,
          visualaizeItem: lu,
          snakemake: kl,
          pipeline: qr,
          hdf5: Uh,
          experiments: Zh,
          workspace: xb,
          user: Rb,
        }),
        qh = Object(Re.a)({ reducer: Gh }),
        Yh = n(1773),
        Xh = n(876),
        $h = Object(Xh.a)({
          components: {
            MuiTextField: { defaultProps: { variant: 'standard' } },
            MuiSelect: { defaultProps: { variant: 'standard' } },
            MuiDialog: { defaultProps: { disableEscapeKeyDown: !0 } },
          },
        })
      l.a.render(
        Object(I.jsx)(u.a.StrictMode, {
          children: Object(I.jsx)(z.a, {
            store: qh,
            children: Object(I.jsx)(Yh.a, {
              theme: $h,
              children: Object(I.jsx)(Ch, {}),
            }),
          }),
        }),
        document.getElementById('root'),
      ),
        Sh()
    },
    919: function (e, t, n) {},
    945: function (e, t, n) {},
    946: function (e, t, n) {},
  },
  [[1676, 1, 2]],
])
//# sourceMappingURL=main.98501836.chunk.js.map
