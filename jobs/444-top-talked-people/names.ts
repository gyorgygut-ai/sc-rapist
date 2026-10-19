const namePattern =
  /\b([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})\s((?:[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})(?:-[a-záéíóöőúüű]{1,})?)\b/g

const stopwords = new Set([
  "A", "Az", "Egy", "Ez", "Ezt", "Azt", "De", "Nem", "Még", "Csak", "Ha", "Mert",
  "Pedig", "Mint", "Két", "Három", "Sok", "Több", "Ma", "Tegnap", "Idén", "Tavaly",
  "Kormány", "Miniszterelnök", "Ország", "Város", "Hétfő", "Kedd", "Szerda",
  "Csütörtök", "Péntek", "Szombat", "Vasárnap", "Január", "Február", "Március",
  // observed homepage noise: organisations, show titles, adverbs
  "Felelős", "Környezetért", "Bizottság", "Bizottságból", "Modern", "Gyárak",
  "Extra", "Umami", "Belpolitika", "Magyarországon", "Biennálén", "Kvangdzsui",
])

export const findNames = (text: string) =>
  new Set(
    [...text.matchAll(namePattern)]
      .map(([, first, last]) => `${first} ${last}`)
      .filter((name) => !name.split(" ").some((word) => stopwords.has(word))),
  )
