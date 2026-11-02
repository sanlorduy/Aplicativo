const SUPABASE_URL = "https://ehhjyxstvjuhfgcagyif.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_LnKW5wxwNv4iiOBhJ0AB7Q_tunYcE-r";

const cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function formatoCOP(valor) {
  return valor.toLocaleString("es-CO");
}

async function cargarCuotas() {
  const { data, error } = await cliente
    .from("cuotas")
    .select("*")
    .order("numero");

  if (error) {
    console.error(error);
    return;
  }

  mostrarResumen(data);
  mostrarCuotas(data);
}

function mostrarResumen(cuotas) {
  const valorCuota = 92800;

  const totalCompromiso = valorCuota * 12;

  const cuotasPagadas = cuotas.filter((c) => c.pagada).length;

  const totalPagado = cuotasPagadas * valorCuota;

  const saldoPendiente = totalCompromiso - totalPagado;

  document.getElementById("totalCompromiso").textContent =
    "$" + formatoCOP(totalCompromiso);

  document.getElementById("totalPagado").textContent =
    "$" + formatoCOP(totalPagado);

  document.getElementById("cuotasPagadas").textContent = cuotasPagadas + "/12";

  document.getElementById("saldoPendiente").textContent =
    "$" + formatoCOP(saldoPendiente);
}

function mostrarCuotas(cuotas) {
  const contenedor = document.getElementById("contenedorCuotas");

  contenedor.innerHTML = "";

  cuotas.forEach((cuota) => {
    contenedor.innerHTML += `
      <div class="cuota-card">

        <h3>
          Cuota ${cuota.numero}
        </h3>

        <div class="valor-cuota">
          $${formatoCOP(cuota.valor)}
        </div>

        <div class="${cuota.pagada ? "pagada" : "pendiente"}">

          ${cuota.pagada ? "✅ Pagada" : "⏳ Pendiente"}

        </div>

        ${
          cuota.fecha_pago
            ? `
            <p>
              Fecha:
              ${new Date(cuota.fecha_pago).toLocaleDateString()}
            </p>
          `
            : ""
        }

        ${
          !cuota.pagada
            ? `
            <button
              onclick="registrarPago(${cuota.numero})">

              Registrar Pago

            </button>

            <input
              type="file"
              accept=".pdf,image/*"
              onchange="subirComprobante(event, ${cuota.numero})">
          `
            : ""
        }

      </div>
    `;
  });
}

async function registrarPago(numero) {
  const { error } = await cliente
    .from("cuotas")
    .update({
      pagada: true,
      fecha_pago: new Date().toISOString(),
    })
    .eq("numero", numero);

  if (error) {
    console.error(error);

    alert("Error al registrar pago");

    return;
  }

  cargarCuotas();
}

async function subirComprobante(event, numero) {
  const archivo = event.target.files[0];

  if (!archivo) return;

  const extension = archivo.name.split(".").pop();

  const nombreArchivo = `cuota_${numero}_${Date.now()}.${extension}`;

  console.log("Bucket:", "comprobantes");
  console.log("Archivo:", archivo.name);
  console.log("Nombre generado:", nombreArchivo);

  const resultado = await cliente.storage
    .from("comprobantes")
    .upload(nombreArchivo, archivo);

  console.log("RESULTADO:");
  console.log(resultado);
}
cargarCuotas();

async function verificarBuckets() {
  const { data, error } = await cliente.storage.listBuckets();

  console.log("BUCKETS:", data);

  console.log("ERROR:", error);
}

verificarBuckets();
