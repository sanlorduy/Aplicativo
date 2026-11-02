const SUPABASE_URL = "https://ehhjyxstvjuhfgcagyif.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_LnKW5wxwNv4iiOBhJ0AB7Q_tunYcE-r";

const cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function probarConexion() {
  console.log("Conectando...");

  const { data, error } = await cliente.from("cuotas").select("*");

  console.log("DATA:", data);

  console.log("ERROR:", error);
}

probarConexion();
