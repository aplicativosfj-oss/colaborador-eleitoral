export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCPF(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function isValidCPF(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(cpf[10])) return false;

  return true;
}

/**
 * Standard título de eleitor checksum (12 digits: 8-digit sequence + 2-digit
 * UF code + 2 check digits). Does not implement the SP/MG (UF 01/02) special
 * case for the 2nd check digit, since campaign voters are registered in Acre.
 */
export function isValidTituloEleitor(value: string) {
  const titulo = onlyDigits(value);
  if (titulo.length !== 12) return false;

  const digits = titulo.split("").map(Number);
  const seq = digits.slice(0, 8);
  const uf1 = digits[8];
  const uf2 = digits[9];

  let sum = 0;
  for (let i = 0; i < 8; i++) sum += (seq[i] as number) * (i + 2);
  let dv1 = sum % 11;
  if (dv1 === 10) dv1 = 0;
  if (dv1 !== digits[10]) return false;

  sum = (uf1 as number) * 7 + (uf2 as number) * 8 + dv1 * 9;
  let dv2 = sum % 11;
  if (dv2 === 10) dv2 = 0;
  if (dv2 !== digits[11]) return false;

  return true;
}

export function formatPhoneBR(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function isValidPhoneBR(value: string) {
  const d = onlyDigits(value);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}

export function formatSecaoEleitoral(value: string) {
  return onlyDigits(value).slice(0, 4);
}

export function isValidSecaoEleitoral(value: string) {
  const d = onlyDigits(value);
  return d.length === 3 || d.length === 4;
}
