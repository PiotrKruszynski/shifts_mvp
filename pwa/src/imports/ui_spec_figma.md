# UI spec dla Figma — aplikacja do zarządzania dyżurami lekarzy

Źródło: `2026-04-24 project_asumptions.md`.

## 1. Założenia projektowe UI

| Obszar                 | Decyzja projektowa                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Produkt                | SaaS do planowania 24-godzinnych dyżurów lekarzy.                                  |
| Główne platformy       | Web desktop-first dla Koordynatora i Admina; mobile-first dla Lekarza.             |
| Role                   | Lekarz, Koordynator, Admin.                                                        |
| Główna zasada UX       | System ma zapobiegać nielegalnym zmianom, a nie tylko raportować je po fakcie.     |
| Najważniejszy stan     | Status grafiku: `Szkic`, `Wygenerowany`, `Opublikowany`, `Zarchiwizowany`.         |
| Krytyczne ograniczenie | Po publikacji grafik jest zamrożony; zmiana odbywa się przez formalną zamianę.     |
| Audyt                  | Każda istotna operacja musi mieć widoczny ślad: kto, kiedy, co zmienił i dlaczego. |

---

## 2. Information Architecture

```text
App
├── Auth
│   ├── Logowanie
│   ├── Rejestracja z zaproszenia
│   └── Reset hasła / SSO
│
├── Lekarz / Mobile-first
│   ├── Dashboard
│   ├── Moja dostępność
│   ├── Mój grafik
│   ├── Wnioski urlopowe
│   ├── Zamiany dyżurów
│   ├── Powiadomienia
│   └── Integracja kalendarza
│
├── Koordynator / Desktop-first
│   ├── Dashboard oddziału
│   ├── Grafiki
│   │   ├── Utwórz grafik
│   │   ├── Zbieranie dostępności
│   │   ├── Generator
│   │   ├── Edytor grafiku
│   │   ├── Raport konfliktów
│   │   └── Publikacja
│   ├── Zamiany do akceptacji
│   ├── Wnioski urlopowe
│   ├── Lekarze
│   ├── Raporty i metryki
│   └── Audyt
│
└── Admin / Desktop
    ├── Użytkownicy
    ├── Role i uprawnienia
    ├── Oddziały
    ├── Koordynatorzy oddziałów
    ├── Konfiguracja systemu
    ├── Logi audytowe
    └── Bezpieczeństwo / zgodność
```

---

## 3. Ekrany — Lekarz, mobile-first

### L-01 — Dashboard lekarza

| Element           | Spec                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Cel               | Szybki podgląd najbliższych obowiązków i akcji wymagających reakcji.                                                 |
| Główne komponenty | Header z imieniem, karta najbliższego dyżuru, status dostępności, deadline zgłoszeń, aktywne zamiany, powiadomienia. |
| Primary CTA       | `Uzupełnij dostępność` albo `Zobacz mój grafik`.                                                                     |
| Secondary CTA     | `Złóż wniosek urlopowy`, `Zarządzaj zamianami`.                                                                      |
| Stany             | Brak grafiku, otwarte zgłoszenia, po deadline, grafik opublikowany, aktywna zamiana.                                 |

### L-02 — Moja dostępność

| Element      | Spec                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Cel          | Lekarz deklaruje dostępność i preferencje przed deadline.                                                               |
| Layout       | Kalendarz miesięczny + dolny panel szczegółów dnia.                                                                     |
| Komponenty   | Day cell, legenda statusów, selector dostępności, selector preferencji kategorii I–III, komentarz, sticky CTA `Zapisz`. |
| Statusy dnia | `Dostępny`, `Niedostępny`, `Preferowany`, `Niepreferowany`, `Urlop oczekujący`, `Urlop zaakceptowany`.                  |
| Walidacja    | Po deadline pola są read-only; UI pokazuje komunikat „Termin zgłoszeń minął”.                                           |
| Empty state  | „Koordynator nie otworzył jeszcze okna zgłoszeń”.                                                                       |

### L-03 — Mój grafik

| Element        | Spec                                                                                    |
| -------------- | --------------------------------------------------------------------------------------- |
| Cel            | Podgląd przypisanych dyżurów.                                                           |
| Layout         | Lista dyżurów + przełącznik widoku `Lista / Kalendarz`.                                 |
| Komponenty     | Shift card, badge kategorii dnia, status opublikowania, akcja `Zaproponuj zamianę`.     |
| Dane na karcie | Data, godziny `00:00–23:59`, oddział, kategoria dnia, status, ewentualny alert limitów. |
| Ograniczenie   | Akcja zamiany widoczna tylko dla grafiku opublikowanego.                                |

### L-04 — Zamiana dyżuru

| Element     | Spec                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| Cel         | Lekarz inicjuje zamianę po publikacji.                                                                         |
| Krok 1      | Wybór własnego dyżuru.                                                                                         |
| Krok 2      | Wybór lekarza przejmującego lub dyżuru do wymiany.                                                             |
| Krok 3      | Podsumowanie i wysłanie propozycji.                                                                            |
| Komponenty  | Stepper, shift picker, doctor picker, validation preview, confirmation modal.                                  |
| Statusy     | `Oczekuje na lekarza`, `Zaakceptowana przez lekarzy`, `Oczekuje na Koordynatora`, `Zatwierdzona`, `Odrzucona`. |
| Error state | „Zamiana niemożliwa — grafik nie jest opublikowany”.                                                           |

### L-05 — Akceptacja propozycji zamiany

| Element              | Spec                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| Cel                  | Drugi lekarz akceptuje lub odrzuca propozycję.                                 |
| Komponenty           | Porównanie dyżurów, wpływ na grafik, CTA `Akceptuję`, CTA `Odrzucam`.          |
| Informacja krytyczna | Akceptacja lekarzy nie finalizuje zamiany; wymagana jest decyzja Koordynatora. |

### L-06 — Wnioski urlopowe

| Element    | Spec                                                             |
| ---------- | ---------------------------------------------------------------- |
| Cel        | Składanie i śledzenie urlopów.                                   |
| Komponenty | Date range picker, typ nieobecności, komentarz, status requestu. |
| Statusy    | `Złożony`, `Zaakceptowany`, `Odrzucony`, `Anulowany`.            |
| Integracja | Zaakceptowany urlop wpływa na dostępność i generator.            |

---

## 4. Ekrany — Koordynator, desktop-first

### C-01 — Dashboard oddziału

| Element     | Spec                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| Cel         | Pulpit operacyjny dla bieżącego okresu planowania.                                                                       |
| Layout      | Top bar + summary cards + tabela aktywnych grafików + alerty.                                                            |
| Karty       | `Status grafiku`, `Deadline dostępności`, `Nieobsadzone dyżury`, `Konflikty`, `Zamiany do akceptacji`, `Ryzyko limitów`. |
| Primary CTA | `Utwórz grafik` albo `Przejdź do edytora`.                                                                               |
| Alerty      | Zbliżający się deadline, brak dostępności od lekarzy, naruszenia odpoczynku, limity tygodniowe.                          |

### C-02 — Utwórz grafik

| Element     | Spec                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Cel         | Inicjacja grafiku w stanie `Szkic`.                                                             |
| Formularz   | Oddział, okres od–do, deadline zgłoszeń, lista lekarzy, liczba dyżurów wynikająca z dni okresu. |
| CTA         | `Utwórz szkic`.                                                                                 |
| Walidacja   | Okres musi być spójny; deadline musi przypadać przed generowaniem/publikacją.                   |
| Po sukcesie | Przekierowanie do ekranu zbierania dostępności.                                                 |

### C-03 — Lekarze w grafiku

| Element             | Spec                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| Cel                 | Zarządzanie pulą lekarzy dla grafiku.                                           |
| Komponenty          | Tabela lekarzy, status konta, status dostępności, kwalifikacje, opt-out, akcje. |
| CTA                 | `Dodaj lekarza`, `Wyślij zaproszenie`, `Usuń z grafiku`.                        |
| Statusy zaproszenia | `Nie wysłano`, `Wysłane`, `Zaakceptowane`, `Wygasłe`.                           |

### C-04 — Zbieranie dostępności

| Element    | Spec                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| Cel        | Monitorowanie kompletności zgłoszeń.                                           |
| Layout     | Tabela lekarzy + heatmapa dostępności.                                         |
| Komponenty | Progress bar zgłoszeń, filtry, deadline banner, resend reminder.               |
| Akcje      | `Wyślij przypomnienie`, `Zamknij okno zgłoszeń`, `Ponownie otwórz zgłoszenia`. |
| Ważne      | Po deadline lekarze nie mogą edytować dostępności.                             |

### C-05 — Generator grafiku

| Element         | Spec                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| Cel             | Uruchomienie deterministycznego generatora.                                              |
| Komponenty      | Summary inputów, lista twardych reguł, lista miękkich priorytetów, CTA `Generuj grafik`. |
| Wynik pozytywny | Stan grafiku przechodzi do `Wygenerowany`; dostępny edytor.                              |
| Wynik negatywny | Grafik zostaje w `Szkic`; pokazany `Raport konfliktów`.                                  |
| Komunikat       | Generator nie używa ML; opiera się na dostępności, regułach i kategoriach preferencji.   |

### C-06 — Edytor grafiku

| Element         | Spec                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Cel             | Ręczne korekty, balansowanie i publikacja.                                                                     |
| Layout          | Główna siatka kalendarza + prawy panel szczegółów + dolny panel walidacji.                                     |
| Widok główny    | Dni miesiąca jako kolumny/karty; dyżur 24h jako pojedynczy slot.                                               |
| Interakcje      | Drag-and-drop lekarza na dyżur, select dyżuru, zmiana przypisania, filtrowanie po kwalifikacjach.              |
| Guardrail       | Nielegalna zmiana jest blokowana w czasie rzeczywistym.                                                        |
| Panel walidacji | `Zgodny`, `Naruszenie odpoczynku 11h`, `Przekroczony limit godzin`, `Konflikt z urlopem`, `Brak kwalifikacji`. |
| CTA             | `Zapisz korekty`, `Uruchom ponownie generator`, `Publikuj grafik`.                                             |
| Wymóg           | Nadpisanie miękkiej preferencji wymaga komentarza.                                                             |

### C-07 — Raport konfliktów

| Element              | Spec                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Cel                  | Wyjaśnienie, dlaczego grafiku nie da się wygenerować.                                           |
| Komponenty           | Lista konfliktów, nieobsadzone dyżury, naruszone reguły, sugerowane działania.                  |
| Akcje                | `Edytuj dostępność`, `Dodaj lekarza`, `Wyślij prośbę do lekarzy`, `Uruchom ponownie generator`. |
| Priorytet informacji | Najpierw twarde ograniczenia, potem urlopy/niedostępność, potem preferencje.                    |

### C-08 — Publikacja grafiku

| Element       | Spec                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| Cel           | Finalne zatwierdzenie grafiku.                                                              |
| Komponenty    | Checklist zgodności, summary obsady, modal potwierdzający, informacja o zamrożeniu grafiku. |
| CTA           | `Publikuj`.                                                                                 |
| Po publikacji | Status `Opublikowany`; wysyłka powiadomień; dostęp ICS; zwykła edycja zablokowana.          |
| Warning       | „Po publikacji zmiany będą możliwe tylko przez procedurę zamiany”.                          |

### C-09 — Zamiany do akceptacji

| Element          | Spec                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| Cel              | Finalna decyzja Koordynatora dla zaakceptowanych zamian.                  |
| Layout           | Inbox wniosków + panel szczegółów.                                        |
| Dane             | Lekarz A, lekarz B, dyżury, status akceptacji lekarzy, wynik walidacji.   |
| Validation badge | `Zgodna` albo `Niezgodna`.                                                |
| Akcje            | `Zatwierdź`, `Odrzuć`, `Zobacz naruszenia`.                               |
| Reguła           | CTA `Zatwierdź` jest disabled, jeśli zamiana narusza twarde ograniczenia. |

### C-10 — Raporty i metryki

| Element    | Spec                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| Cel        | Monitorowanie obciążeń i zgodności.                                                     |
| Wykresy    | Liczba dyżurów per lekarz, święta/weekendy per lekarz, nadgodziny, opt-out, odpoczynek. |
| Komponenty | Bar chart, table, filters, export CSV/PDF.                                              |
| Alerty     | Zbliżenie do limitu tygodniowego/miesięcznego, nierówna dystrybucja kategorii dni.      |

### C-11 — Audyt grafiku

| Element      | Spec                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| Cel          | Odtworzenie historii zmian.                                                     |
| Komponenty   | Timeline zdarzeń, filtry po aktorze/typie operacji, diff zmian, eksport.        |
| Dane         | Data, użytkownik, akcja, encja, poprzednia wartość, nowa wartość, uzasadnienie. |
| Ograniczenie | Logi są tylko do odczytu.                                                       |

---

## 5. Ekrany — Admin

### A-01 — Użytkownicy

| Element    | Spec                                                                |
| ---------- | ------------------------------------------------------------------- |
| Cel        | Zarządzanie kontami.                                                |
| Komponenty | Tabela użytkowników, filtry roli/statusu, akcje aktywuj/dezaktywuj. |
| Akcje      | `Dodaj użytkownika`, `Zmień rolę`, `Dezaktywuj konto`.              |

### A-02 — Oddziały i Koordynatorzy

| Element    | Spec                                                                |
| ---------- | ------------------------------------------------------------------- |
| Cel        | Przypisanie jednego Koordynatora do oddziału.                       |
| Komponenty | Lista oddziałów, aktywny Koordynator, historia przypisań.           |
| Walidacja  | Tylko jeden aktywny Koordynator może edytować dany grafik oddziału. |

### A-03 — Konfiguracja systemu

| Element | Spec                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------- |
| Cel     | Konfiguracja parametrów globalnych i oddziałowych.                                                    |
| Sekcje  | Kategorie preferencji, typy powiadomień, limity prawne, eksporty, język PL/EN.                        |
| Uwaga   | Część polityk pozostaje do decyzji projektowej, więc UI powinien obsługiwać stan „niedostępne w MVP”. |

### A-04 — Logi audytowe i zgodność

| Element      | Spec                                               |
| ------------ | -------------------------------------------------- |
| Cel          | Przegląd operacji systemowych i bezpieczeństwa.    |
| Komponenty   | Audit table, filtry, eksport, szczegóły zdarzenia. |
| Ograniczenie | Brak edycji/usuwania logów.                        |

---

## 6. Komponenty Figma

| Komponent               | Warianty                                                               | Użycie                                       |
| ----------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| **ScheduleStatusBadge** | `Szkic`, `Wygenerowany`, `Opublikowany`, `Zarchiwizowany`              | W dashboardach, listach i edytorze.          |
| **ShiftCard**           | `Nieobsadzony`, `Obsadzony`, `Konflikt`, `Zamiana oczekuje`            | Kalendarz lekarza i edytor Koordynatora.     |
| **DoctorCard**          | `Aktywny`, `Zaproszony`, `Brak dostępności`, `Nieaktywny`              | Lista lekarzy i drag-and-drop.               |
| **AvailabilityDayCell** | `Dostępny`, `Niedostępny`, `Preferowany`, `Niepreferowany`, `Urlop`    | Kalendarz dostępności.                       |
| **ConstraintAlert**     | `Info`, `Warning`, `Blocking error`, `Success`                         | Walidacja korekt i zamian.                   |
| **ValidationBadge**     | `Zgodna`, `Niezgodna`, `Niezwalidowana`                                | Zamiany, edytor, publikacja.                 |
| **SwapRequestCard**     | `Oczekuje`, `Zaakceptowana przez lekarzy`, `Zatwierdzona`, `Odrzucona` | Lekarz i Koordynator.                        |
| **AuditTimelineItem**   | `Create`, `Update`, `Generate`, `Publish`, `Swap`, `Override`          | Ekran audytu.                                |
| **MetricCard**          | `Normal`, `Warning`, `Critical`                                        | Dashboard Koordynatora.                      |
| **DeadlineBanner**      | `Open`, `Closing soon`, `Closed`                                       | Dashboard i dostępność.                      |
| **ConfirmationModal**   | `Publish`, `Override soft rule`, `Approve swap`, `Reject request`      | Operacje wymagające potwierdzenia.           |
| **EmptyState**          | Różne ilustracje/teksty                                                | Brak grafiku, brak dostępności, brak zamian. |

---

## 7. Stany i reguły UI

| Reguła                              | Zachowanie UI                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Grafik w `Szkic`                    | Koordynator może konfigurować, zbierać dostępność i uruchamiać generator.                                       |
| Grafik w `Wygenerowany`             | Koordynator może edytować przydziały i publikować.                                                              |
| Grafik w `Opublikowany`             | Zwykła edycja zablokowana; dostępne zamiany.                                                                    |
| Grafik w `Zarchiwizowany`           | Tylko odczyt i eksport.                                                                                         |
| Deadline dostępności minął          | Lekarz widzi formularz read-only.                                                                               |
| Korekta narusza hard constraint     | UI blokuje zapis i pokazuje konkretną regułę.                                                                   |
| Korekta narusza soft preference     | UI pozwala zapisać tylko z uzasadnieniem.                                                                       |
| Zamiana niezgodna z hard constraint | Koordynator widzi naruszenia; przycisk zatwierdzenia disabled.                                                  |
| Lekarz bez konta                    | Koordynator widzi status zaproszenia i może wysłać ponownie.                                                    |
| Brak kwalifikacji/licencji          | Status `UNKNOWN` lub `INVALID`; system nie powinien automatycznie przypisywać lekarza bez pozytywnej walidacji. |

---

## 8. Proponowane frame’y w Figma

```text
00 Foundations
├── Colors
├── Typography
├── Spacing
├── Icons
└── Components base

01 Auth
├── Login
├── Invitation signup
└── SSO login

02 Doctor Mobile
├── Dashboard
├── Availability calendar
├── My schedule list
├── My schedule calendar
├── Leave request form
├── Swap request wizard
├── Swap approval
└── Notifications

03 Coordinator Desktop
├── Department dashboard
├── Create schedule
├── Schedule participants
├── Availability collection
├── Generator
├── Schedule editor
├── Conflict report
├── Publish confirmation
├── Swap approvals
├── Leave approvals
├── Metrics dashboard
└── Audit log

04 Admin Desktop
├── Users
├── Roles
├── Departments
├── Coordinator assignments
├── System settings
└── Compliance audit

05 Prototypes
├── Doctor availability submission
├── Coordinator generate and publish
└── Post-publication swap
```

---

## 9. Najważniejsze decyzje UX

1. Koordynator dostaje interfejs desktopowy z siatką i drag-and-drop, bo główna praca polega na przeglądzie wielu dni, lekarzy, konfliktów i metryk jednocześnie.
2. Lekarz dostaje mobile-first flow, bo jego praca jest punktowa: zgłoszenie dostępności, sprawdzenie dyżuru, zaakceptowanie lub zainicjowanie zamiany.
3. Walidacja prawna jest częścią interakcji, nie osobnym raportem po zapisaniu. To ogranicza ryzyko błędów, bo nielegalna korekta nie może wejść do grafiku.
4. Status grafiku musi być stale widoczny. Od niego zależą dostępne akcje, więc badge statusu powinien występować w nagłówku każdego ekranu związanego z grafikiem.
5. Procedura zamiany powinna być projektowana jako workflow akceptacyjny, nie jako zwykła edycja grafiku. To utrzymuje audytowalność i zgodność z zasadą zamrożenia opublikowanego grafiku.