export const MUNICIPIOS_ACRE = [
  "Acrelândia",
  "Assis Brasil",
  "Brasiléia",
  "Bujari",
  "Capixaba",
  "Cruzeiro do Sul",
  "Epitaciolândia",
  "Feijó",
  "Jordão",
  "Mâncio Lima",
  "Manoel Urbano",
  "Marechal Thaumaturgo",
  "Plácido de Castro",
  "Porto Acre",
  "Porto Walter",
  "Rio Branco",
  "Rodrigues Alves",
  "Santa Rosa do Purus",
  "Sena Madureira",
  "Senador Guiomard",
  "Tarauacá",
  "Xapuri",
] as const;

export type MunicipioAcre = (typeof MUNICIPIOS_ACRE)[number];

/**
 * Coordenadas aproximadas da sede de cada município do Acre.
 * Usadas apenas para centralizar o mapa quando uma seção ainda não tem
 * latitude/longitude cadastradas — nunca como dado oficial de localização.
 */
export const MUNICIPIO_COORDS: Record<string, { lat: number; lng: number }> = {
  Acrelândia: { lat: -9.8253, lng: -66.8967 },
  "Assis Brasil": { lat: -10.9403, lng: -69.5675 },
  Brasiléia: { lat: -11.0006, lng: -68.7489 },
  Bujari: { lat: -9.8153, lng: -67.9494 },
  Capixaba: { lat: -10.5711, lng: -67.6739 },
  "Cruzeiro do Sul": { lat: -7.6306, lng: -72.6708 },
  Epitaciolândia: { lat: -11.0289, lng: -68.7375 },
  Feijó: { lat: -8.1653, lng: -70.3542 },
  Jordão: { lat: -9.1953, lng: -71.8747 },
  "Mâncio Lima": { lat: -7.6136, lng: -72.8961 },
  "Manoel Urbano": { lat: -8.8386, lng: -69.2597 },
  "Marechal Thaumaturgo": { lat: -8.9394, lng: -72.7889 },
  "Plácido de Castro": { lat: -10.3353, lng: -67.185 },
  "Porto Acre": { lat: -9.5931, lng: -67.5417 },
  "Porto Walter": { lat: -8.2686, lng: -72.7442 },
  "Rio Branco": { lat: -9.9747, lng: -67.8243 },
  "Rodrigues Alves": { lat: -7.7378, lng: -72.6494 },
  "Santa Rosa do Purus": { lat: -9.4453, lng: -70.4867 },
  "Sena Madureira": { lat: -9.0658, lng: -68.6572 },
  "Senador Guiomard": { lat: -10.1508, lng: -67.7361 },
  Tarauacá: { lat: -8.1614, lng: -70.7658 },
  Xapuri: { lat: -10.6519, lng: -68.5017 },
};

/** Centro aproximado do estado do Acre, usado como fallback do mapa. */
export const ACRE_CENTER = { lat: -9.2, lng: -70.0 };
