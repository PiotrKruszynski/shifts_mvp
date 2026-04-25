# Założenia Projektowe — Aplikacja do Zarządzania Dyżurami Lekarzy (Wersja 2026)

---

## 1. Cel projektu

- **Cel biznesowy:** Dostarczenie specjalistycznego systemu SaaS do planowania dyżurów medycznych, eliminującego błędy manualne i gwarantującego 100% zgodności z polskim prawem pracy (UDL, Kodeks Pracy).
    
- **Rozwiązywany problem:** - szpitale bazują obecnie na arkuszach kalkulacyjnych i ręcznej koordynacji; prowadzi to do błędów, nieprzestrzegania limitów prawnych (dobowych/tygodniowych godzin oraz odpoczynku) oraz niezadowolenia lekarzy, którzy nie mogą łatwo zarządzać dostępnością ani wymieniać dyżurów .  Aplikacja adresuje deficyt kadr poprzez optymalizację istniejącego personelu i automatyzację tworzenia grafików.
    
- **Oczekiwany rezultat:** - dostarczenie platformy w modelu SaaS, która umożliwia koordynatorom generowanie i publikowanie grafików na podstawie deklarowanej dostępności i ograniczeń prawnych, pozwala lekarzom wprowadzać preferencje, składać wnioski urlopowe i wymieniać dyżury, a także zapewnia czytelne powiadomienia i analitykę.  System powinien integrować się z prywatnymi kalendarzami i monitorować zgodność, zmniejszając czas administracyjny o około 70–80 %.

---

## 2. Użytkownicy i Role

| **Rola**               | **Odpowiedzialności**                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Uprawnienia**                                                                                                                                                                                                                                                     | **Zakres decyzyjności**                                                                                                                                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Koordynator dyżuru** | Zbiera deklaracje dostępności i preferencje; definiuje okres planowania i termin zgłaszania „dostępniaków”; dodaje nowych lekarzy do harmonogramu (również tych spoza systemu) poprzez wpisanie ich danych i wysłanie zaproszenia e‑mail; uruchamia generowanie grafiku; ręcznie koryguje harmonogram; weryfikuje zgodność z przepisami; publikuje grafiki; zatwierdza lub odrzuca wnioski o zamianę po publikacji; monitoruje statystyki obciążeń i dba o sprawiedliwość. | Tworzenie i edycja grafików roboczych dla swojego oddziału; podgląd wszystkich dostępności; dodawanie lekarzy spoza systemu wraz z ich adresem e‑mail; modyfikacja rozkładu w granicach prawa; zatwierdzanie/odrzucanie wniosków urlopowych i zamian; archiwizacja. | Ostateczna decyzja o publikacji i modyfikacjach w granicach twardych ograniczeń.  Nie może naruszyć twardych reguł prawnych; odnotowuje uzasadnienie przy nadpisaniu preferencji miękkich.  Każdy oddział posiada tylko jednego Koordynatora pracującego nad danym grafikiem. |
| **Lekarz**             | Utrzymuje własną dostępność i preferencje w ramach wyznaczonego terminu zgłoszeń; składa wnioski urlopowe; przegląda przypisane dyżury; inicjuje i akceptuje zamiany z innymi lekarzami po opublikowaniu grafiku; odbiera powiadomienia i integruje grafik z prywatnym kalendarzem.                                                                                                                                                                                        | Podgląd własnego grafiku; wprowadzanie dostępności i preferencji; inicjowanie i odpowiadanie na wnioski o zamianę; wnioskowanie o urlop; synchronizacja grafiku z kalendarzem prywatnym.                                                                            | Brak – może wpływać na przydziały poprzez preferencje i zamiany, ale nie publikuje grafiku ani nie nadpisuje przydziałów.                                                                                                                                                     |
| **Admin**              | Zarządza systemem na poziomie globalnym: tworzy i utrzymuje konta użytkowników, przypisuje Koordynatorów do oddziałów, konfiguruje podstawowe parametry (np. kategorie dyżurów, terminy zgłaszania dostępności) oraz monitoruje przestrzeganie polityk bezpieczeństwa i NIS2.  Nie uczestniczy w codziennym planowaniu dyżurów.                                                                                                                                            | Ma pełne uprawnienia administracyjne: może zakładać, modyfikować i dezaktywować konta użytkowników; nadawać role i uprawnienia; konfigurować ustawienia systemowe.  Nie edytuje grafików, chyba że pełni jednocześnie rolę Koordynatora.                            | Decyduje o konfiguracji systemu, nadzorze i zgodności z regulacjami (RODO, NIS2); nie ingeruje w przydziały dyżurów.                                                                                                                                                          |

---

## 3. Główny Workflow (End-to-End)

1. **Konfiguracja i inicjacja grafiku** – Koordynator definiuje okres planowania (np. miesiąc) dla swojego oddziału oraz termin końcowy zgłaszania preferencji (“dostępniaków”).  Ustala liczbę dyżurów 24‑godzinnych do obsadzenia i może dodać lekarzy spoza systemu poprzez wprowadzenie ich danych i wysłanie zaproszenia e‑mail, aby mogli później wprowadzać swoje preferencje.
2. **Zbieranie dostępności i preferencji** – Lekarze (także nowo zaproszeni po potwierdzeniu konta) logują się przez przeglądarkę lub aplikację mobilną i zaznaczają dostępność oraz preferencje dotyczące dyżurów 24‑godzinnych, a także składają wnioski urlopowe.  System potwierdza przyjęcie zgłoszeń i blokuje modyfikacje po upływie wyznaczonego terminu.
3. **Generowanie grafiku** – Po zamknięciu okna zgłoszeń Koordynator uruchamia generator grafiku.  System uwzględnia zgłoszone dostępności, twarde ograniczenia prawne (np. normy czasu pracy i odpoczynku)  oraz stały system miękkich preferencji oparty na trzech kategoriach dni (np. Święta Bożego Narodzenia/Wielkanoc/Sylwester jako kategoria I; długie weekendy i ustawowe dni wolne jako kategoria II; inne preferowane dyżury jak 14 lutego lub czwartkowe zmiany jako kategoria III).  System nie stosuje uczenia maszynowego; kolejność przydziałów jest deterministyczna w oparciu o priorytet kategorii.  Twarde ograniczenia muszą być spełnione; w przypadku braku możliwej obsady system tworzy raport konfliktów.
4. **Ręczne korekty** – Koordynator przegląda wygenerowany grafik, koryguje przydziały w celu równomiernego obciążenia oraz obsadzenia wolnych 24‑godzinnych dyżurów i rozwiązuje konflikty.  W trakcie zmian system na bieżąco weryfikuje twarde ograniczenia.
5. **Publikacja** – Po zatwierdzeniu Koordynator publikuje grafik.  Przydziały stają się widoczne i zamrożone; stan grafiku zmienia się na _opublikowany_.  System wysyła powiadomienia (e‑mail/push) do lekarzy i synchronizuje dyżury z prywatnymi kalendarzami.
6. **Zmiany po publikacji (zamiany dyżurów)** – Lekarze mogą składać wnioski o zamianę dopiero po publikacji grafiku: wybierają własny dyżur i proponują wymianę z innym lekarzem.  Drugi lekarz akceptuje lub odrzuca propozycję; po zgodzie obu stron Koordynator weryfikuje wniosek pod kątem twardych ograniczeń i zatwierdza zamianę.  System zapisuje transakcję w dzienniku audytu.
7. **Monitoring i raportowanie** – Koordynator śledzi metryki (liczbę przydziałów, nadgodziny, wykorzystanie opt‑out, zgodność z odpoczynkiem) poprzez pulpity menedżerskie.  System wysyła alerty w przypadku zbliżania się do limitów tygodniowych lub miesięcznych.
8. **Archiwizacja** – Po zakończeniu okresu planowania lub po stworzeniu nowego grafiku dotychczasowy grafik jest archiwizowany do wglądu i raportów.  Grafiki archiwalne są tylko do odczytu.

---

## 4. Cykl życia grafiku (State Machine)

|**Stan**|**Opis**|**Dozwolone działania**|**Kto może modyfikować**|**Przejście do**|
|---|---|---|---|---|
|**Szkic (Draft)**|Początkowy stan po utworzeniu.  Zawiera zgłoszone dostępności i preferencje, ale brak finalnych przydziałów.|Dodawanie/usuwanie uczestników; edycja dostępności; uruchomienie generowania; ręczne korekty; weryfikacja ograniczeń.|Koordynator (w pełni); lekarze mogą edytować własną dostępność do terminu granicznego.|_Wygenerowany_ (po uruchomieniu algorytmu) lub pozostaje _Szkic_ do czasu generacji.|
|**Wygenerowany (Generated)**|Szkic utworzony przez algorytm.  Przydziały są zaproponowane, ale nie są finalne.|Koordynator może modyfikować przydziały, wymuszać równowagę, dodawać/usuwać dyżury; algorytm może być uruchomiony ponownie.|Tylko Koordynator.|_Opublikowany_ (po zatwierdzeniu) lub _Szkic_ (jeśli odrzucony).|
|**Opublikowany (Published)**|Finalny grafik widoczny dla lekarzy.  Przydziały są zamrożone, wyjątek stanowi procedura zamiany.|Przegląd grafiku; składanie wniosków o zamianę; składanie wniosków urlopowych po publikacji; monitorowanie statystyk.  Koordynator może zatwierdzać zamiany i drobne modyfikacje.|Lekarze (podgląd, wnioski o zamianę); Koordynator (zatwierdzanie zamian, drobne korekty).|_Zarchiwizowany_ (po zastąpieniu) lub pozostaje _Opublikowany_ do czasu nowego grafiku.|
|**Zarchiwizowany (Archived)**|Historyczny grafik do celów audytu i raportów.  Nie można go modyfikować.|Podgląd, eksport.|Wszystkie role z odpowiednimi uprawnieniami.|Brak – stan końcowy.|
Przejścia są inicjowane wyłącznie przez Koordynatora (generacja i publikacja) lub automatycznie po zakończeniu okresu (archiwizacja).  Grafiki nie mogą wrócić do poprzednich stanów – w razie konieczności należy utworzyć nowy szkic.

---

## **5. Kluczowe pojęcia domeny (wysoki poziom)**

- **Lekarz** – użytkownik reprezentujący medyka z ograniczeniami kontraktowymi dotyczącymi czasu pracy.  Posiada dane osobowe, deklaracje dostępności, preferencje i uprawnienia zawodowe.  Jest przydzielany do dyżurów w ramach grafików.
- **Koordynator** – użytkownik administracyjny odpowiedzialny za tworzenie i publikację grafików; może być również lekarzem, ale działa w roli koordynatora.
- **Grafik (Schedule)** – zbiór przydziałów dyżurów dla określonego okresu i jednostki.  Posiada stan cyklu życia (Szkic, Wygenerowany, Opublikowany, Zarchiwizowany).  Powiązany jest z jednym Koordynatorem i wieloma Lekarzami.
- **Dyżur (Shift)** – jednostka pracy w systemie, zawsze 24‑godzinna.  Każdy dyżur rozpoczyna się o 00:00 i kończy o 23:59 tego samego dnia.  Do jednego dyżuru przypisuje się dokładnie jednego lekarza posiadającego odpowiednie kwalifikacje.  Grafik składa się z tylu dyżurów, ile jest dni w okresie planowania.
- **Dostępność (Availability)** – deklaracja lekarza wskazująca chęć lub brak możliwości pracy w konkretnym czasie.  Obejmuje preferencje i wnioski urlopowe.
- **Przydział (Assignment)** – powiązanie między Lekarzem a Dyżurem w ramach Grafiku.  Przechowuje stan przydziału (proponowany, potwierdzony) i wlicza się do limitów czasu pracy.
- **Wniosek o zamianę (SwapRequest)** – prośba złożona po publikacji przez Lekarza o wymianę przydzielonego dyżuru z innym lekarzem.  Zawiera identyfikatory dyżurów, zaangażowanych lekarzy, status (oczekujący, zaakceptowany, odrzucony, zatwierdzony) i znaczniki czasu.
- **Wniosek urlopowy (LeaveRequest)** – wniosek Lekarza o urlop w okresie planowania.  Musi zostać zatwierdzony przez Koordynatora i wpływa na dostępność oraz kwalifikowalność do przydziału.
- **Ograniczenie (Constraint)** – reguła rządząca generowaniem i modyfikacją grafiku (np. prawne limity czasu pracy, minimalne przerwy).  Klasyfikowane jako twarde lub miękkie.
- **Wpis w dzienniku audytu (AuditLogEntry)** – zapis każdej istotnej operacji (utworzenie, modyfikacja, zatwierdzenie) z datą, użytkownikiem i szczegółami zmian.  Używany do zgodności i śledzenia.
- **Admin** – użytkownik z uprawnieniami administracyjnymi, zarządzający kontami użytkowników, przypisujący role i konfigurujący parametry systemowe.  Nie bierze udziału w planowaniu dyżurów, ale odpowiada za nadzór i zgodność systemu z obowiązującymi regulacjami.
- **Kategoria preferencji (PreferenceCategory)** – ustalony poziom ważności określonych dni w roku, wykorzystywany przy generowaniu grafików jako stały system wag miękkich preferencji.  Wyróżnia się co najmniej trzy kategorie: I – kluczowe święta (np. Boże Narodzenie, Wielkanoc, Sylwester); II – ustawowe dni wolne i długie weekendy (np. majówka, 11 listopada); III – inne preferowane dni (np. 14 lutego, czwartki dające długi weekend).  Lekarze mogą zaznaczyć preferencje względem tych kategorii, a system stosuje priorytety zgodnie z kategorią.

---

## **6. Twarde ograniczenia (rygory prawne)**

Twarde ograniczenia muszą być zawsze spełnione; system odrzuca grafiki, które je naruszają:

1. **Dobowy czas pracy** – Łączna liczba zaplanowanych godzin dla jednego lekarza w ciągu doby nie może przekroczyć 7 h 35 min pracy podstawowej .  Dyżur medyczny (24‑godzinny) w całości wlicza się do czasu pracy i podlega limitom tygodniowym; nie ma dyżurów on‑call w ramach tego systemu.
2. **Tygodniowy czas pracy** – Średni tygodniowy czas pracy (łącznie z dyżurami) nie może przekraczać 37 h 55 min.  Za zgodą (klauzula opt‑out) maksymalny limit tygodniowy wynosi 48 h; rozszerzony limit 78 h dotyczy tylko przypadków, gdy podpisano opt‑out i zachowano wymagane okresy odpoczynku  .
3. **Minimalny odpoczynek** – Między końcem jednego dyżuru a początkiem kolejnego musi upłynąć co najmniej 11 nieprzerwanych godzin .  Grafik musi zapewnić tygodniowy odpoczynek wynoszący co najmniej 35 h (wyjątkowo 24 h) .
4. **Jeden przydział na dyżur** – Dany dyżur może być przypisany tylko jednemu lekarzowi; nakładające się przydziały dla tego samego lekarza są zabronione.
5. **Dopasowanie licencji i kwalifikacji** – Przydziały muszą odpowiadać wymaganym kwalifikacjom (specjalizacja, licencja) dla dyżuru; system musi weryfikować, że uprawnienia lekarza są ważne (np. nie wygasły).  W przypadku braku danych status jest **UNKNOWN**.
6. **Długość i liczba dyżurów** – System planuje wyłącznie dyżury 24‑godzinne i obsadza każdy dyżur dokładnie jednym lekarzem.  Dzielenie dyżuru na krótsze sloty lub pozostawienie nieobsadzonych części doby jest niedozwolone.
7. **Niezmienność opublikowanego grafiku** – Po publikacji przydziały nie mogą być modyfikowane poza procedurą zamiany; doraźne zmiany muszą stosować zasady audytu i zatwierdzeń.
8. **Ścieżka audytu** – Wszystkie zmiany (generowanie, ręczne korekty, zatwierdzenie zamiany) muszą być logowane z datą i użytkownikiem.  Logi nie podlegają modyfikacji.

---

## **7. Miękkie ograniczenia (preferencje / optymalizacja)**

Miękkie ograniczenia kierują optymalizacją harmonogramu, lecz mogą być pomijane w razie konieczności zapewnienia obsady.  System nie wykorzystuje uczenia maszynowego ani dynamicznego punktowania; zamiast tego stosuje stały zestaw priorytetów:

1. **Kategorie preferencji** – Lekarze mogą zaznaczyć, że chcą lub nie chcą dyżurować w określonych dniach, które należą do trzech zdefiniowanych kategorii.  System nadaje najwyższy priorytet życzeniom dla Kategorii I (święta takie jak Boże Narodzenie, Wielkanoc, Sylwester), średni priorytet dla Kategorii II (ustawowe dni wolne i długie weekendy, np. majówka, 11 listopada) oraz najniższy priorytet dla Kategorii III (inne preferowane dni, np. 14 lutego, czwartki dające długi weekend).  Preferencje z wyższej kategorii są brane pod uwagę przed niższymi.
2. **Sprawiedliwość** – Minimalizować różnice w liczbie przypisanych dyżurów i w liczbie dyżurów w kluczowych kategoriach.  System dąży do równomiernego przydzielenia świąt, weekendów i powszednich 24‑godzinnych dyżurów, aby uniknąć przeciążenia wybranych osób.
3. **Elastyczność dostępności** – Zgłoszona niedostępność (urlop, wyjazd) ma priorytet nad preferencjami.  Preferencje mogą być pominięte, jeśli jedynym sposobem obsady dyżuru jest przypisanie lekarza wbrew jego preferencji.
4. **Dystrybucja obciążenia** – Ponieważ każdy dyżur trwa 24 godziny, system dąży do unikania układów, w których lekarz dyżuruje zbyt często w krótkim odstępie czasu.  Przypisania powinny być rozproszone, aby zapewnić regenerację.
5. **Historyczna równowaga** – W miarę możliwości należy uwzględniać wcześniejsze okresy planowania, aby nie powierzać niekorzystnych dni wciąż tym samym osobom.  Szczegóły algorytmu historycznej równowagi pozostają **TO BE DECIDED**.

Miękkie ograniczenia są implementowane jako deterministyczny system priorytetów; preferencje z wyższej kategorii i zasada sprawiedliwości są realizowane, o ile nie kolidują z twardymi ograniczeniami i zgłoszoną niedostępnością.

---

## **8. Zasady rozwiązywania konfliktów**

Gdy algorytm nie może spełnić wszystkich twardych ograniczeń i preferencji:

1. **Identyfikacja naruszeń** – System generuje raport z listą konfliktowych dyżurów i przyczynami (np. niewystarczająca liczba dostępnych lekarzy, naruszenie wymogu odpoczynku).
2. **Strategie awaryjne** – Koordynator może ręcznie korygować przydziały kontaktując się z lekarzami lub ponownie otwierając okno zgłaszania dostępności.  System może sugerować przemieszczenia w oparciu o minimalne zakłócenie harmonogramu.
3. **Hierarchia priorytetów** – Twarde ograniczenia prawne > niedostępność lekarza (urlop) > sprawiedliwość i preferencje.  Twardych ograniczeń nie wolno naruszać; preferencje można pominąć na końcu.
4. **Ręczne nadpisanie** – Koordynator może nadpisać miękkie ograniczenie (np. przydzielić lekarza w niepreferowanym dniu) pod warunkiem, że odnotuje uzasadnienie.  Nadpisanie twardych ograniczeń jest **niedozwolone**, chyba że prawo przewiduje wyjątek (np. opt‑out); takie przypadki muszą być logowane i raportowane.
5. **Eskalacja** – Jeśli konflikt utrzymuje się (np. brak obsady 24‑godzinnego dyżuru przy zachowaniu twardych ograniczeń), system oznacza taki dyżur jako **nieobsadzony** i powiadamia Koordynatora oraz Admina o konieczności pozyskania dodatkowego lekarza.  Nie ma automatycznej integracji z wewnętrznymi systemami HR ani zewnętrznymi systemami państwowymi; poszukiwanie zastępstwa odbywa się poza systemem.  Po dodaniu nowego lekarza Koordynator może ponownie uruchomić generowanie grafiku.  Sposób obsługi długotrwałych braków personelu pozostaje **TO BE DECIDED**.

---

## **9. Współbieżność i współpraca**

- **Jednoczesna edycja** – System zakłada model jednego Koordynatora przypisanego do oddziału i konkretnego grafiku; tylko ten Koordynator może edytować dany grafik.  Współbieżne edycje przez wielu koordynatorów nie są obsługiwane.
- **Kontrola wersji** – Każda zmiana stanu (np. dodanie lekarza, korekta przydziału, publikacja) jest zapisywana w dzienniku audytu.  System zachowuje historię zmian, ale nie przewiduje automatycznego przywracania poprzednich wersji; korekty dokonuje się poprzez kolejne zmiany.
- **Obsługa konfliktów** – Ponieważ tylko jeden Koordynator ma prawo edycji grafiku, konflikt edycji nie występuje.  Zmiana koordynatora jest decyzją administracyjną podejmowaną przez Admina; po zmianie prawa do edycji poprzedni Koordynator traci dostęp do modyfikacji.

---

## **10. Audyt i śledzenie**

- Każda istotna operacja (utworzenie, złożenie dostępności, generowanie grafiku, ręczna zmiana, publikacja, wniosek o zamianę/akceptacja) musi zostać zapisana jako **AuditLogEntry** z datą, użytkownikiem, typem operacji i szczegółami.  Logi muszą być niezmienne i przechowywane przez okres zgodny z wymogami prawa.
- Dzienniki audytu powinny umożliwiać odtworzenie historii grafiku i wspierać kontrole zgodności (np. przez Państwową Inspekcję Pracy).  Użytkownicy z uprawnieniami administracyjnymi mogą przeglądać logi; edycja lub usuwanie logów jest zabronione.
- **Przywracanie (rollback)** – Przywracanie do poprzedniej wersji grafiku nie jest określone w badaniach i pozostaje **UNKNOWN**; system może polegać na ręcznej korekcie.

---

## **11. Nadpisywanie i nadzór**

- **Uprawnienia do nadpisywania** – Tylko Koordynator może nadpisywać przydziały lub preferencje.  Twardych ograniczeń nie wolno nadpisywać, z wyjątkiem przypadków przewidzianych prawem (opt‑out), a każde nadpisanie musi zawierać uzasadnienie.
- **Zarządzanie** – System powinien wymuszać kontrolę dostępu opartą na rolach, wymagać potwierdzenia dla nadpisywań oraz prowadzić dziennik audytowy wszystkich takich operacji.
- **Konfiguracja polityk** – Możliwość dostosowania wag miękkich ograniczeń, zasad zatwierdzania zamian i maksymalnych godzin tygodniowych poza domyślnymi limitami (w ramach prawa) jest **TO BE DECIDED**.

## **12. Obsługa błędów**

| **Scenariusz**                                                                                   | **Zachowanie systemu**                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nie można wygenerować grafiku** (brak możliwego przydziału zgodnego z twardymi ograniczeniami) | System zwraca raport konfliktów wskazujący niespełnione ograniczenia i nieobsadzone dyżury; grafik pozostaje w stanie _Szkic_.  Koordynator musi ręcznie zmienić dostępność lub parametry.                         |
| **Konflikt ograniczeń podczas ręcznej korekty**                                                  | Interfejs powinien blokować nielegalne zmiany w czasie rzeczywistym i wyświetlać jasny komunikat o naruszonym ograniczeniu (np. „nie spełniono minimalnego wymogu odpoczynku”).                                    |
| **Niewystarczająca liczba lekarzy**                                                              | System oznacza dyżur jako wolny/nierozdzielony i powiadamia Koordynatora; sugeruje kontakt z dodatkowymi lekarzami lub zewnętrznymi usługami.  Automatyczne przydzielanie poza zgłoszoną pulę nie jest wykonywane. |
| **Wniosek o zamianę narusza twarde ograniczenie**                                                | System odrzuca wniosek, wyjaśniając przyczynę; zamiana nie jest realizowana.                                                                                                                                       |
| **Awaria systemu lub utrata danych**                                                             | Badania nie definiują procedur awaryjnych; strategia tworzenia kopii zapasowych i przywracania pozostaje **UNKNOWN** i wymaga decyzji.                                                                             |

## **13. Wrażliwość danych i bezpieczeństwo**

- **Dane osobowe** – Obejmują imię, nazwisko, dane kontaktowe, dostępność i wzorce pracy lekarzy.  Dane te są wrażliwe i muszą być przechowywane bezpiecznie, z szyfrowaniem w spoczynku i w transmisji.  Dostęp tylko dla uprawnionych ról.
- **Prywatność medyczna** – Choć system obsługuje harmonogramy, nie przetwarza danych pacjentów; jednak niewłaściwe użycie mogłoby pośrednio ujawnić wzorce pracy i zmęczenia.  Udostępnianie danych stronom trzecim jest zabronione, chyba że wymagane prawem.
- **Widoczność oparta na rolach** – Lekarze widzą tylko własny grafik oraz ograniczone dane zbiorcze (np. liczbę wolnych dyżurów).  Koordynator ma dostęp do wszystkich grafików i preferencji w ramach swojego oddziału.  Admin ma dostęp do konfiguracji systemu i logów audytowych, ale nie do pełnych danych osobowych lekarzy poza koniecznością zarządzania kontami.  Brak dostępu publicznego.
- **Logowanie i zgodność** – Wszystkie działania są audytowalne.  System musi spełniać wymagania RODO/GDPR, w tym prawo dostępu i usunięcia danych w zakresie, w jakim nie koliduje to z obowiązkami ustawowymi.
- **Bezpieczeństwo cybernetyczne (NIS2)** – Od 2025 r. system musi spełniać wymogi dyrektywy NIS2 dotyczące bezpieczeństwa sieci i informacji.  Obejmuje to m.in. ocenę ryzyka, zarządzanie incydentami, kontrolę dostępu, szyfrowanie, mechanizmy zapobiegania wyciekom danych oraz procedury zgłaszania naruszeń właściwym organom.  Szczegółowe wymagania implementacyjne NIS2 będą określone w ramach projektu i muszą zostać uwzględnione w planie rozwoju.

---

## **14. Kluczowe decyzje**

- System będzie priorytetyzował zgodność z polskim prawem pracy (UDL i Kodeks pracy); te reguły są zakodowane jako twarde ograniczenia.  Każde odstępstwo musi być odnotowane i uzasadnione przez Koordynatora.
- Cykl życia grafiku z czterema stanami (Szkic → Wygenerowany → Opublikowany → Zarchiwizowany) zostanie zaimplementowany, aby zapewnić wyraźne granice między edycją a finalizacją.  Opublikowane grafiki są tylko do odczytu, z wyjątkiem procedury zamiany.
- Harmonogram tworzy wyłącznie dyżury 24‑godzinne; system nie obsługuje innych długości dyżurów ani ich podziału.
- Silnik generowania grafików wykorzystuje zgłoszoną dostępność, twarde ograniczenia i stałe kategorie miękkich preferencji (trzy pule dni) do wygenerowania szkicu.  System nie stosuje uczenia maszynowego ani dynamicznych algorytmów punktowych.
- System będzie dostępny w interfejsie webowym i mobilnym; dane będą przechowywane w centralnej bazie z szyfrowaniem.  Dostęp offline do ostatniego pobranego grafiku jest pożądany, ale poza zakresem pierwszej wersji.
- Role w systemie ograniczają się do Lekarza, Koordynatora dyżurów oraz Admina.  Admin zarządza konfiguracją, Koordynator odpowiada za planowanie w swoim oddziale, a Lekarz utrzymuje własne preferencje i wnioski.
- Każdy oddział ma wyznaczonego jednego Koordynatora; nie przewiduje się współbieżnej edycji tego samego grafiku przez wiele osób.
- Koordynator może dodawać do grafiku lekarzy spoza systemu, wprowadzając ich adres e‑mail i wysyłając zaproszenie.  Lekarz uzyskuje dostęp do aplikacji po akceptacji zaproszenia.
- Integracja z wewnętrznymi systemami HR/płac oraz z zewnętrznymi platformami państwowymi (np. P1) nie jest planowana w pierwszej wersji; dane są wprowadzane i zarządzane wyłącznie wewnątrz aplikacji.
- System musi spełniać wymagania NIS2 dotyczące bezpieczeństwa i raportowania incydentów, oprócz RODO/GDPR.

---

## **15. Zakres MVP**

- **Funkcje zawarte**:
    - Rejestracja/logowanie użytkownika (e‑mail lub instytucjonalne SSO) z trzema rolami: Admin, Koordynator i Lekarz.
    - Zarządzanie profilami lekarzy i Koordynatorów; Koordynator może dodawać lekarzy spoza systemu poprzez wprowadzenie ich adresu e‑mail i wysłanie zaproszenia do rejestracji.  Lekarze utrzymują własne deklaracje dostępności i wnioski urlopowe w wyznaczonym terminie zgłoszeń.
    - Tworzenie grafiku 24‑godzinnych dyżurów z generowaniem opartym na twardych ograniczeniach i stałych kategoriach preferencji (bez uczenia maszynowego).  Algorytm przydziału stosuje z góry ustalone priorytety dla trzech pul dni świątecznych/wolnych i rozdziela dyżury zgodnie z nimi.
    - Ręczna korekta wygenerowanego grafiku przez Koordynatora, w tym możliwość dopisywania lekarzy spoza systemu.  Wszystkie zmiany są weryfikowane pod kątem twardych ograniczeń.
    - Publikacja grafików z powiadomieniami (e‑mail i push) dla lekarzy oraz synchronizacją z kalendarzem (format ICS).  Po publikacji grafik jest zamrożony, a wnioski o zamianę są jedynym sposobem jego modyfikacji.
    - Procedura wniosków o zamianę: inicjowana przez lekarza po publikacji, musi być zaakceptowana przez wskazanego lekarza i zatwierdzona przez Koordynatora.
    - Pulpit dla Koordynatora pokazujący liczbę przydziałów na osobę, obciążenie w poszczególnych kategoriach dni, wykorzystanie opt‑out, nadgodziny i zgodność odpoczynku.
    - Logowanie audytowe wszystkich operacji oraz uprawnień; możliwość przeglądania logów przez Admina i Koordynatora.
    - Aplikacja mobilna „mobile‑first” dla Lekarza (funkcje: zgłaszanie dostępności, przegląd „mój grafik”, składanie/akceptowanie zamian) oraz interfejs webowy „desktop‑first” dla Koordynatora (obsługa siatki i drag‑and‑drop).  Powiadomienia push i e‑mail zawierają przypomnienia o terminie zgłoszeń i publikacji grafiku.
- **Ograniczenia/Uproszczenia**:
    - Brak integracji z wewnętrznymi systemami kadrowo‑płacowymi, systemami rozliczeń czy platformami e‑zdrowia; dane można eksportować wyłącznie w formatach CSV/PDF, a wszelkie integracje pozostają poza zakresem.
    - Harmonogramowanie dotyczy pojedynczego oddziału/jednostki.  Każdy oddział posiada jednego Koordynatora, a grafiki nie są współdzielone między jednostkami; koordynacja między oddziałami jest poza zakresem.
    - Brak współbieżności – w danym czasie edycję grafiku wykonuje wyłącznie wyznaczony Koordynator.  Wersjonowanie i przywracanie ograniczają się do logów audytu; nie ma mechanizmu cofania.
    - Brak prognozowania ani analiz predykcyjnych; algorytm generowania wykorzystuje jedynie zgłoszone dostępności i stałe priorytety kategorii bez uczenia maszynowego.
    - Stała długość dyżuru wynosi 24 godziny; system nie obsługuje innych schematów zmian ani podziału dyżurów.
    - Wersje językowe ograniczone do polskiego i angielskiego; inne języki i funkcje dostępności są **TO BE DECIDED**.

---

## **16. Poza zakresem**

- Obliczanie wynagrodzenia, fakturowanie czy zarządzanie finansami.
- Zarządzanie certyfikatami, licencjami i automatyczną weryfikacją uprawnień (poza prostym śledzeniem dat ważności).
- Integracja z danymi pacjentów czy elektroniczną dokumentacją medyczną.
- Funkcjonalności rekrutacyjne lub rynek pracy (np. zatrudnianie zewnętrznych lekarzy) poza oznaczaniem wolnych dyżurów.
- Telemedycyna, planowanie wizyt pacjentów czy procedury kliniczne.
- Wiadomości w czasie rzeczywistym czy funkcje społecznościowe; komunikacja ograniczona do powiadomień i wniosków o zamianę.
- Obsługa innych ról (np. pielęgniarek, ratowników) chyba że zostaną dodane w późniejszym etapie.

---

## **17. Otwarte pytania / nieznane** / zatwierdzone

- **Resolved:** W każdym oddziale nad jednym grafikiem pracuje jeden wyznaczony Koordynator; współbieżna edycja jest zabroniona.
- **Resolved:** - **Strategia backupu i odzyskiwania danych** – szczegółowa polityka backupów, RPO, RTO, testy odtwarzania, procedury disaster recovery oraz docelowy model retencji backupów są poza zakresem MVP. W MVP system musi umożliwiać bezpieczne przechowywanie danych, logowanie zmian i eksport danych, ale pełna strategia ciągłości działania zostanie zdefiniowana na etapie wdrożenia produkcyjnego i zgodności z NIS2.
- **Resolved:** Konkretne wymagania dotyczące hostingu danych (lokalnie w szpitalu czy w chmurze) dla placówek publicznych.
- **Resolved:** Role w systemie są ograniczone do Lekarza, Koordynatora i Admina; dodanie innych ról nie jest planowane na etapie MVP.
- **TO BE DECIDED:** Szczegółowa definicja kategorii preferencji (jakie dni należą do której kategorii oraz sposób ich priorytetyzacji) oraz reguły historycznej równowagi.
- **Resolved:** Integracja z systemami państwowymi i kadrowo‑płacowymi nie jest planowana; dane są zarządzane wyłącznie w ramach aplikacji.
- **TO BE DECIDED:** Szczegóły interfejsu UI/UX, takie jak schemat kolorów, biblioteka komponentów i zgodność z normami dostępności.
- **Resolved:** Polityka zatwierdzania wniosków o zamianę 
## **Polityka zatwierdzania wniosków o zamianę dyżuru**

- Zamiana dyżuru jest możliwa wyłącznie po publikacji grafiku.
- Lekarz inicjujący zamianę wybiera swój dyżur 24h i wskazuje lekarza: (jednego lub kilku, kto pierwszy ten lepszy)  przejmującego albo dyżur do wymiany.
- Po akceptacji obu lekarzy wniosek automatycznie przechodzi do statusu: **zaakceptowany przez lekarzy**.
- Akceptacja obu lekarzy nie finalizuje zamiany.
- Finalna zmiana grafiku wymaga obowiązkowej akceptacji Koordynatora dyżurów.
- Przed zatwierdzeniem Koordynator musi otrzymać jasną informację, czy proponowana zamiana jest zgodna z regułami systemu.
- System pokazuje Koordynatorowi wynik walidacji: **zgodna** albo **niezgodna**.
- Jeśli zamiana jest niezgodna, system wskazuje naruszone reguły, np. brak 11h odpoczynku, przekroczenie limitu godzin, konflikt z urlopem albo L4.
- Koordynator nie może zatwierdzić zamiany naruszającej twarde ograniczenia prawne.
- Po zatwierdzeniu przez Koordynatora system aktualizuje grafik, wysyła powiadomienia do obu lekarzy i zapisuje zmianę w logu audytowym.




