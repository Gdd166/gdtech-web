// Contador de visitas de GDTECH: suma 1 por visita (no por cada recarga) y muestra el total en el pie.
(async function () {
  var el = document.getElementById("visitas");
  if (!el) return;
  var metodo = "POST";
  try {
    if (sessionStorage.getItem("gd_visita")) metodo = "GET";
    else sessionStorage.setItem("gd_visita", "1");
  } catch (e) {}
  try {
    var r = await fetch("/api/visitas", { method: metodo });
    if (!r.ok) return;
    var d = await r.json();
    el.textContent = "Visitas: " + Number(d.visitas).toLocaleString("es-AR");
    el.hidden = false;
  } catch (e) {}
})();
