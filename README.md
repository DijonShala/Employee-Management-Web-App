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
## Zunanji vir

Aplikacija dostopa do zunanjega vira [FXRatesAPI](https://fxratesapi.com/) preko katerega pridobi aktualne vrednosti menjalnih tečajev za vse svetovne valute.

## Iskanje

Pri /analytics lahko iščemo plače po mescu in letu ter filtriramo zaposlene po želenih podatkih

## Master/Detail

Pri /departments če kliknemo na želen department se odpre seznam delavcev, ki delajo v tem oddelku. Če kliknemo delavca se odpre njegov profil
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

- email (string, enoličen, oblika email),

- hireDate, payDate, endDate, startDate, dueDate, appliedAt tipa Date (select polje)

- clock_in_time, clock_out_time tipa Date

- status, role tipa string (select polje / enum)

- salary, basicSalary, deductions, netSalary, allowances tipa number

## Tehnološki izzvi
### 1. Internacionalizacija

Aplikacija je podprta v več jezikih preko Angular internacionalizacije (i18n). Internacionalizacija uporabniku omogoča prikaz strani prilagojene različnim jezikom in kulturnim nastavitvam.

Podprta jezika sta angleščina in slovenščina.

### 2. Napredni Angular gradniki

1. Knjižnica jsPDF

Aplikacija uporablja knjižnico jsPDF za generiranje PDF dokumentov neposredno v brskalniku, kar omogoča enostaven prenos plačilnih list s prilagojenimi podatki.

Vsebina PDF dokumentov se dinamično prilagaja glede na podatke iz aplikacije, kar zagotavlja personalizacijo za vsakega uporabnika (npr. konverzije valut, formati datumov, prilagojeni naslovi).

2. AG Grid

 Zmogljiva in prilagodljiva JavaScript knjižnica za izdelavo visokozmogljivih in prilagodljivih tabel v spletnih aplikacijah. Uporabljali smo jo za boljše prikazovanje tabel

 ## Opis decentralizirane aplikacije
 S pomočjo Dapp bo administrator izplačeval plače delavcev. Ob registraciji delavcev shranimo tudi njihov javni ključ. Na začetku administrator naredi depozit ( funkcija fundContract) iz katerega se nato izplačuje plače. Potem dodajamo račune v seznam, ti vsebujejo javni ključ in plače delavcev. Nato lahko iz seznama izberemo na kater račun hočemo nakazati plačo in kliknemo transfer.

 Javni in privatni ključi testnih računov:

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (100 ETH) (Admin)

Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (100 ETH)

Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (100 ETH)

Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (100 ETH)

Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (100 ETH)

Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (100 ETH)

Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (100 ETH)

Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (100 ETH)

Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (100 ETH)

Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (100 ETH)

Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (100 ETH)

Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

## Zunanja knjižnica

ReentrancyGuard.sol je pogodba iz knjižnice OpenZeppelin, ki preprečuje reentrancy napade v pametnih pogodbah. Takšni napadi omogočajo zlonamernemu uporabniku, da zlorabi stanje pogodbe tako, da večkratno izvede funkcijo, preden se stanje pogodbe posodobi. To je ena najpogostejših varnostnih ranljivosti v pametnih pogodbah.

##  Zagon verige blokov
```
npx hardhat node
```
```
npx hardhat compile
```
```
npx hardhat ignition deploy ./ignition/modules/SimplePay.ts --network localhost
```