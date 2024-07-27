function detectAdBlock() {
  const adUrl =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  const testAd = document.createElement("script");
  testAd.src = adUrl;
  testAd.onerror = function () {
    function handleAdBlock(tabElement, messageId) {
      if (tabElement) {
        const observer = new MutationObserver(() => {
          const buttons = tabElement.querySelectorAll("table tr td .btn");
          if (buttons.length > 0) {
            buttons.forEach((button) => (button.disabled = true));
            if (!document.getElementById(messageId)) {
              const message = document.createElement("p");
              message.id = messageId;
              message.textContent =
                "Please disable adblock to download videos.";
              message.style.color = "red";
              message.style.margin = "5px 0px";
              message.style.fontWeight = "600";
              message.style.border = "1px solid #ccc";
              message.style.padding = "5px 0";
              tabElement.insertBefore(message, tabElement.firstChild);
            }
          }
        });
        observer.observe(tabElement, { childList: true, subtree: true });
      }
    }
    const tabVideo = document.getElementById("tabVideo");
    const tabAudio = document.getElementById("tabAudio");
    handleAdBlock(tabVideo, "adblockMessageVideo");
    handleAdBlock(tabAudio, "adblockMessageAudio");
  };
  document.body.appendChild(testAd);
  testAd.onload = () => {
    document.body.removeChild(testAd);
  };
}
window.onload = detectAdBlock;
!(function t(e, n, a) {
  function r(r, l) {
    if (!n[r]) {
      if (!e[r]) {
        var o = "function" == typeof require && require;
        if (!l && o) return o(r, !0);
        if (i) return i(r, !0);
        var d = Error("Cannot find module '" + r + "'");
        throw ((d.code = "MODULE_NOT_FOUND"), d);
      }
      var s = (n[r] = { exports: {} });
      e[r][0].call(
        s.exports,
        function (t) {
          return l(e[r][1][t] || t);
        },
        s,
        s.exports,
        t,
        e,
        n,
        a,
      );
    }
    return n[r].exports;
  }
  for (
    var i = "function" == typeof require && require, l = 0;
    l < a.length;
    l++
  )
    r(a[l]);
  return r;
})(
  {
    1: [
      function (t, e, n) {
        function a(t) {
          let e = $("#txtUrl").val();
          "" !== e && (t = e),
            t &&
              ($.ajaxSetup({
                headers: {
                  "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                },
              }),
              $("#progress").hide(),
              $.ajax({
                url: "/analyze",
                type: "POST",
                data: { url: e },
                dataType: "json",
                beforeSend: function () {
                  $("#imgAnalyzer").show(),
                    $("#result").hide(),
                    $("#error").hide(),
                    $("#btnSubmit").attr("disabled", !0);
                },
                success: function (t) {
                  try {
                    if (
                      ($("#imgAnalyzer").hide(),
                      $("#btnSubmit").attr("disabled", !1),
                      !0 == t.error || 3 == t)
                    )
                      (e = t.message),
                        $("#result").hide(),
                        $("#error-text").html(
                          '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                            e,
                        ),
                        $("#error").show();
                    else {
                      (n = t.formats),
                        $("#error").hide(),
                        -1 != n.thumbnail.indexOf("maxresdefault.webp")
                          ? document
                              .getElementById("thumbnail")
                              .classList.remove("mystyle")
                          : document
                              .getElementById("thumbnail")
                              .classList.add("mystyle"),
                        $("#thumbnail")
                          .attr("src", n.thumbnail)
                          .removeClass("img1x1")
                          .addClass("thumnail-img"),
                        $("#videoTitle").html(
                          `<b>${n.title}<br>Duration: ${(function (t) {
                            var e = 0,
                              n = 0,
                              a = 0;
                            if (t < 60) a = t;
                            else if (t < 3600)
                              a = t - 60 * (n = Math.floor(t / 60));
                            else {
                              var r = t - 3600 * (e = Math.floor(t / 3600));
                              a = r - 60 * (n = Math.floor(r / 60));
                            }
                            var i = "";
                            return (
                              e > 0 &&
                                (i += e.toString().padStart(2, "0") + ":"),
                              (i += n.toString().padStart(2, "0") + ":"),
                              (i += a.toString().padStart(2, "0"))
                            );
                          })(n.duration)} minutes</b>`,
                        ),
                        d(
                          filterVideosByMaxQuality(n.video, "1080p"),
                          "#tabVideo",
                        ),
                        d(n.audio, "#tabAudio"),
                        c(
                          n,
                          filterVideosByMaxQuality(n.video, "1080p"),
                          n.id,
                          !0,
                          t.url,
                        ),
                        c(n, n.audio, n.id, !1, t.url),
                        $("#result").show();
                      var e,
                        n,
                        a = (document.getElementById("tabs").style.display =
                          "block");
                    }
                  } catch (r) {}
                },
                complete: function () {
                  $("#imgAnalyzer").hide();
                },
                error: function (t) {},
              }));
        }
        function r(t, e, n, a, r, all) {
          let i = a;
          let o = t + e;
          $.ajax({
            type: "POST",
            url: "/convert",
            data: { hash: n },
            success: function (a) {
              try {
                if (!n.error) {
                  let d = f[o];
                  if (!d) {
                    l(t, e, a.taskId, i, r, all),
                      (d = setInterval(function () {
                        l(t, e, a.taskId, i, r, all);
                      }, 3e3)),
                      (f[o] = d);
                    let s = document.getElementById("btn" + e);
                    (s.innerHTML = ""), s.appendChild(u(e));
                  }
                }
              } catch (c) {}
            },
          });
        }
        function i(t) {
          let e = f[t];
          e && (clearInterval(e), delete f[t]);
        }
        function l(t, e, n, a, r, all) {
          let l = t + e;
          $.ajax({
            type: "POST",
            url: "/task",
            data: { taskId: n },
            success: function (t) {
              try {
                var n = document.getElementById("btn" + e);
                if (t.error) {
                  n.innerHTML = "Failed";
                  all.video.forEach((r) =>
                    $("#btn" + r.formatId)
                      .find("button")
                      .attr("disabled", false),
                  );
                  all.audio.forEach((r) =>
                    $("#btn" + r.formatId)
                      .find("button")
                      .attr("disabled", false),
                  );
                  i(l);
                } else if (t.ext == "mp3") {
                  if (t.download_progress >= 100) {
                    document.getElementById("e" + e).style.width =
                      t.convert_progress + "%";
                    document
                      .getElementById("e" + e)
                      .setAttribute("aria-valuenow", t.convert_progress);
                    document.getElementById("e" + e).innerHTML = t.status;
                    if (t.download) {
                      n.innerHTML = "";
                      n.id = "btnOk";
                      n.appendChild(s(t.download, true, a, all));
                      i(l);
                    }
                  } else {
                    document.getElementById("e" + e).style.width =
                      t.download_progress + "%";
                    document
                      .getElementById("e" + e)
                      .setAttribute("aria-valuenow", t.download_progress);
                    document.getElementById("e" + e).innerHTML = t.status;
                  }
                } else if (t.status != "failed") {
                  document.getElementById("e" + e).style.width =
                    t.download_progress + "%";
                  document
                    .getElementById("e" + e)
                    .setAttribute("aria-valuenow", t.download_progress);
                  document.getElementById("e" + e).innerHTML = t.status;
                  if (t.download) {
                    n.innerHTML = "";
                    n.id = "btnOk";
                    n.appendChild(s(t.download, true, a, all));
                    i(l);
                  }
                } else if (t.status == "failed") {
                  n.innerHTML = "Failed";
                  all.video.forEach((o) =>
                    $("#btn" + o.formatId)
                      .find("button")
                      .attr("disabled", false),
                  );
                  all.audio.forEach((o) =>
                    $("#btn" + o.formatId)
                      .find("button")
                      .attr("disabled", false),
                  );
                  i(l);
                }
              } catch (d) {
                console.error("Error in success callback:", d);
              }
            },
          });
        }
        function o(t, e) {
          var n = Math.pow(10, e || 0);
          return Math.round(t * n) / n;
        }
        function bytesToMB(bytes) {
          const mb = bytes / (1024 * 1024);
          return mb.toFixed(2);
        }
        function d(t, e) {
          var n,
            a = '<table class="tableVideo">';
          a += "<th>Quality</th><th>File size</th><th>Status</th>";
          for (var r = 0; r < t.length; r++) {
            let i = t[r],
              l = "<tr>";
            320 == i.quality ||
            256 == i.quality ||
            192 == i.quality ||
            128 == i.quality ||
            64 == i.quality ||
            48 == i.quality
              ? ((l += `<td>(.${i.fileType}) ${i.quality}kbps</td>`),
                (l = l + "<td>" + `${(n = i.filesize)}` + "</td>"),
                (l += `<td id="btn${i.formatId}"></td>`),
                (l += "</tr>"),
                (a += l))
              : ((l += `<td>(.${i.fileType}) ${i.quality}</td>`),
                (l = l + "<td>" + `${(n = i.filesize)}` + "</td>"),
                (l += `<td id="btn${i.formatId}"></td>`),
                (l += "</tr>"),
                (a += l));
          }
          (a += "</table>"), $(e).html(a);
        }
        function s(t, e, n, all) {
          let a = document.createElement("button");
          a.className = "btn";
          let r = document.createElement("a");
          for (let i of all.video)
            $("#btn" + i.formatId)
              .find("button")
              .attr("disabled", !1);
          for (let i of all.audio)
            $("#btn" + i.formatId)
              .find("button")
              .attr("disabled", !1);
          return (
            (r.href = t),
            e,
            (r.style = "text-decoration:none;"),
            (r.download = ""),
            (r.innerHTML =
              '<span class="glyphicon glyphicon-download-alt"></span>Download'),
            a.appendChild(r),
            (a.onclick = function (t) {
              t.target === r
                ? e &&
                  windows.open(
                    "https://www.highcpmgate.com/jrc7nus4a?key=e7e54107a7a9e6dde58e1a1f7431db34",
                  )
                : r.click();
            }),
            a
          );
        }
        function filterVideosByMaxQuality(videos, maxQuality) {
          const maxQualityNumber = parseInt(maxQuality.replace(/\D/g, ""), 10);
          return videos.filter((video) => {
            const videoQualityNumber = parseInt(
              video.quality.replace(/\D/g, ""),
              10,
            );
            return videoQualityNumber <= maxQualityNumber;
          });
        }
        function u(t) {
          let e = document.createElement("div");
          return (
            (e.id = t),
            (e.innerHTML =
              '<div class="lds-ring"><div></div><div></div><div></div><div></div></div> <br> <div class="progress"> <div  id="e' +
              t +
              '"  class="progress-bar" role="progressbar"  aria-valuemin="0" aria-valuemax="100" > </div></div><div id="failederr" style="display:none; color:red;"><p>Try Again</p></div>'),
            e
          );
        }
        function c(all, t, e, n, a) {
          let vid = all.video;
          let aud = all.audio;
          var i = t;
          for (let l of t) {
            let o = document.getElementById("btn" + l.formatId),
              d = document.createElement("button");
            (d.type = "submit"),
              (d.className = "btn"),
              (d.innerHTML = n
                ? '<span class="glyphicon glyphicon-film"></span>Convert'
                : '<span class="glyphicon glyphicon-music"></span>Convert');
            let c = e + l.formatId;
            l.needConvert
              ? (d.onclick = function () {
                  for (let t of vid)
                    $("#btn" + t.formatId)
                      .find("button")
                      .attr("disabled", !0);
                  for (let t of aud)
                    $("#btn" + t.formatId)
                      .find("button")
                      .attr("disabled", !0);
                  r(e, l.formatId, l.hash, i, a, all);
                })
              : (d.onclick = function () {
                  for (let t of vid)
                    $("#btn" + t.formatId)
                      .find("button")
                      .attr("disabled", !0);
                  for (let t of aud)
                    $("#btn" + t.formatId)
                      .find("button")
                      .attr("disabled", !0);
                  (o.innerHTML = ""),
                    o.appendChild(u(c)),
                    setTimeout(function () {
                      o.innerHTML = "";
                      let t = "36" != l.quality;
                      o.appendChild(s(l.url, t, i, all));
                      o.id = "btnOk";
                    }, 1200);
                }),
              o.appendChild(d);
          }
        }
        (window.openTab = function (t, e) {
          var n, a, r;
          for (
            a = document.getElementsByClassName("tabcontent"), n = 0;
            n < a.length;
            n++
          )
            a[n].style.display = "none";
          for (
            r = document.getElementsByClassName("tablinks"), n = 0;
            n < r.length;
            n++
          )
            r[n].className = r[n].className.replace(" active", "");
          (document.getElementById(e).style.display = "block"),
            (t.currentTarget.className += " active");
        }),
          $("form").bind("keypress", function (t) {
            if (13 == t.keyCode) return a(), !1;
          }),
          $("#txtUrl").on("paste", function () {
            var t = this;
            setTimeout(function () {
              a($(t).val());
            }, 100);
          }),
          (window.getListFormats = a);
        let f = {};
        var p = 1048576,
          m = 1024 * p,
          b = 1024 * m,
          g = new URLSearchParams(document.location.search),
          y = g.get("v");
        if (y) {
          var v = "https://www.youtube.com/watch?v=" + y;
          $("#txtUrl").val(v), a();
        }
        (v = g.get("url")) && ($("#txtUrl").val(v), a());
      },
      {},
    ],
  },
  {},
  [1],
),
  $("#convert-more").click(function () {
    location.reload();
  }),
  $(document).ready(function () {
    $("input.deletable")
      .wrap('<span class="deleteicon"></span>')
      .after(
        $("<span class='glyphicon glyphicon-remove'></span>").click(
          function () {
            $(this).prev("input").val("").trigger("change").focus();
          },
        ),
      );
  });
