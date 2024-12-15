# Spletno programiranje 2024/2025
Lastni projekt pri predmetu **Spletno programiranje** v študijskem letu **2024/2025**.

## Opis aplikacije
Naša aplikacija je namenjena spremljanju delovnih ur in zahtevkov zaposlenih. Glavni cilj aplikacije je omogočiti učinkovit nadzor nad delovnimi procesi in zagotavljanje enostavnega dostopa do relavantnih podatkov za različne uporabniške vloge. Aplikacija vključuje funkcionalnosti za administratorje in zaposlene.

Funkcionalnosti:

- Več uporabniških vlog
- Registracija novega uporabnika
- Prijava in odjava uporabnika
- Oddaja prošenj za odsotnost
- Potrditev ali zavrnitev prošenj
- Urejanje in pregled podatkov zaposlenih
- Dodeljevanje nalog

Povezave do zaslonskih mask:
- [Login stran](./docs/login.html)
- [Beleženje prisotnosti](./docs/clockin.html)
- [Koledar za spremljanje nalog](./docs/calendar.html)
- [Stran za oddajo prošenj](./docs/leaves.html)
- [Nastavitve uporabnika](./docs/usersettings.html)
- [Seznam uporabnikov (Admin)](./docs/users.html)
- [Dodajanje zaposlenega (Admin)](./docs/adduser.html)

Prikaz in delovanje strani v različnih brskalnikih deluje pravilno (Chrome, Firefox, Microsoft Edge). Aplikacija se prilagodi različnim velikostim zaslona.

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

- Uporablja se za preverjanje veljavnosti podatkov, preden so ti shranjeni v podatkovno bazo.

## Avtentikcija in avtorizacija

Gost - ima možnost prijave v aplikacijo, pa v okviru naše naloge še, da uvozi začetne podatke v podatkovno bazo in jih izbriše.

Prijavljeni uporabniki (administrator):

- Lahko dodaja nove zaposlene, posodobi svoje in njihove podatke, izbriše zaposlene, pridobiva podatke o zaposlenih,
- Lahko dodaja place, ima vpogled v vse place, izbrise place
- Lahko dodeli naloge, ima vpogled v vse naloge, izbriše naloge
- Lahko odobri dopuste, da prošnjo za dopust, izbriše dopuste
- Lahko se prijavi/odjavi na delo
- Lahko ustvarja, posodablja, izbriše nove oddelke, pridobiva zaposlene glede na oddelek

Prijavljeni uporabniki (navadni uporabnik):

- Se lahko prijavi/odjavi od dela, lahko pridobi podatke o svoji prisotnosti
- Lahko odda prošnjo za dopust, pridobi svoje prošnje dopustov,
- Lahko pridobi svoje plače,
- Lahko posodablja stanje svoje naloge

## Validacija uporabniških vnosov

- userName (enoličen), firstName, lastName, jobTitle, departmentId, address (string), phoneNumber, name, reason, description

- password (string), min(6)

-  email (string, enoličen, oblika email),

- hireDate, payDate, endDate, startDate, dueDate, appliedAt tipa Date (select polje)

- clock_in_time, clock_out_time tipa Date

- status, role tipa string (select polje / enum)

- salary, basicSalary, deductions, netSalary, allowances tipa number

