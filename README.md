# Spletno programiranje 2024/2025

Lastni projekt pri predmetu **Spletno programiranje** v študijskem letu **2024/2025**.

## Dostopno na
https://clock-in.onrender.com

## Zaganjanje pri razvijanju:

```
npm start
```

## Zaganjane produkcija:

```
docker compose up --build --force-recreate
```
## Dodatni knižnici
Nodemailer:
- Uporablja se da obvesti zaposlene, da je bil njihov račun kreiran skupaj z uporabniškim imenon in geslon, ter s sporočilom, da si geslo čim prej zamenjajo,
- Obvesti zaposlene, ko jim je dodana plača
Joi:
- Uporablja se za preverjanje veljavnosti podatkov, preden so ti shranjeni v bazo.

## Avtentikcija in avtorizacija
Gost - ima možnost prijave v aplikacijo, pa v okviru naše naloge še, da uvozi začetne podatke v podatkovno bazo in jih izbriše.
Prijavljeni uporabniki (administrator):
- Lahko dodaja nove zaposlene, posodobi svoje in njihove podatke, izbriše zaposlene, pridobiva podatke o zaposlenih,
- Lahko dodaja place, ima vpogled v vse place, izbrise place
- Lahko dodeli naloge, ima vpogled v vse naloge, izbriše naloge
- Lahko odobri dopuste, da prošnjo za dopust, izbriše dopuste
- Lahko pridobiva stanje prisotnosti zaposlenih, se prijavi/odjavi na delo
- Lahko ustvarja, posodablja, izbriše nove oddelke, pridobiva zaposlene glede na oddelek
Prijavljeni uporabniki (navadni uporabnik):
- Ima vpogled do svojih podatkov, lahko spreminja svoje podatke (razen podatka za "role")
- Se lahko prijavi/odjavi od dela, lahko pridobi podatke o svoji prisotnosti
- Lahko odda prošnjo za dopust, priobi svoje prošnje dopustov,
- Lahko pridobi svoje plače,
- Lahko posodablja stanje svoje naloge
