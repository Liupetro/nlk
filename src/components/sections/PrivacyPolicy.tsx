"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";

type Section = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

const copy = {
  ru: {
    sections: [
      {
        heading: "1. Общие положения",
        paragraphs: [
          "Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Андреем Скорняну (далее — Оператор).",
        ],
        items: [
          "1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека при обработке его персональных данных.",
          "1.2. Настоящая Политика применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта https://www.aldetali.com, и размещена на странице https://www.aldetali.com/privacy.",
        ],
      },
      {
        heading: "2. Основные понятия, используемые в Политике",
        items: [
          "2.1. Автоматизированная обработка персональных данных — обработка с помощью средств вычислительной техники.",
          "2.2. Блокирование персональных данных — временное прекращение обработки (кроме уточнения данных).",
          "2.3. Веб-сайт — совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, доступных по адресу https://www.aldetali.com.",
          "2.4. Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных и обеспечивающих их обработку технологий.",
          "2.5. Обезличивание персональных данных — действия, в результате которых невозможно определить принадлежность данных конкретному Пользователю.",
          "2.6. Обработка персональных данных — любые действия с данными.",
          "2.7. Оператор — лицо, самостоятельно или совместно с другими осуществляющее обработку персональных данных.",
          "2.8. Персональные данные — любая информация, относящаяся к определенному или определяемому Пользователю веб-сайта https://www.aldetali.com.",
          "2.9. Пользователь — любой посетитель веб-сайта https://www.aldetali.com.",
          "2.10. Предоставление персональных данных — раскрытие данных определенному лицу или кругу лиц.",
          "2.11. Распространение персональных данных — раскрытие данных неопределенному кругу лиц.",
          "2.12. Трансграничная передача персональных данных — передача на территорию иностранного государства.",
          "2.13. Уничтожение персональных данных — действия, приводящие к безвозвратному уничтожению данных.",
        ],
      },
      {
        heading: "3. Основные права и обязанности Оператора",
        paragraphs: ["3.1. Оператор имеет право:"],
        items: [
          "— получать от субъекта достоверную информацию;",
          "— продолжать обработку без согласия субъекта при наличии законных оснований;",
          "— самостоятельно определять меры для выполнения обязанностей по Закону о персональных данных.",
        ],
      },
      {
        heading: "3.2. Оператор обязан:",
        items: [
          "— предоставлять субъекту информацию по его запросу;",
          "— организовывать обработку в соответствии с законодательством РФ;",
          "— отвечать на обращения субъектов;",
          "— публиковать или обеспечивать доступ к настоящей Политике;",
          "— принимать меры по защите персональных данных;",
          "— прекращать обработку и уничтожать данные в случаях, предусмотренных законом.",
        ],
      },
      {
        heading: "4. Основные права и обязанности субъектов персональных данных",
        paragraphs: ["4.1. Субъекты имеют право:"],
        items: [
          "— получать информацию об обработке;",
          "— требовать уточнения, блокирования или уничтожения данных;",
          "— отзывать согласие на обработку;",
          "— обжаловать действия или бездействие Оператора.",
        ],
      },
      {
        heading: "4.2. Субъекты обязаны:",
        items: [
          "— предоставлять достоверные персональные данные;",
          "— сообщать об изменении своих данных.",
        ],
      },
      {
        heading: "5. Принципы обработки персональных данных",
        items: [
          "5.1. Обработка осуществляется на законной и справедливой основе.",
          "5.2. Обработка ограничивается достижением конкретных и законных целей.",
          "5.3. Подлежат обработке только данные, отвечающие целям.",
          "5.4. Объем данных соответствует заявленным целям.",
          "5.5. Обеспечивается точность и актуальность данных.",
          "5.6. Хранение осуществляется не дольше, чем этого требуют цели обработки.",
        ],
      },
      {
        heading: "6. Цели обработки персональных данных",
        paragraphs: [
          "Цель обработки: обработка заявок, оставленных пользователем на сайте через формы обратной связи, подготовка коммерческих предложений и связь с пользователем.",
          "Персональные данные: имя / название компании, номер телефона, адрес электронной почты, сведения из прикреплённых файлов (чертёж / 3D-модель), технические данные (IP-адрес, User-Agent, дата и время обращения).",
          "Правовые основания: согласие субъекта на обработку персональных данных.",
          "Виды обработки: сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, удаление, уничтожение.",
        ],
      },
      {
        heading: "7. Условия обработки персональных данных",
        items: [
          "7.1. Обработка осуществляется с согласия субъекта.",
          "7.2. Обработка может осуществляться при наличии иных законных оснований, предусмотренных законодательством РФ.",
        ],
      },
      {
        heading: "8. Порядок сбора, хранения и передачи персональных данных",
        items: [
          "8.1. Оператор обеспечивает сохранность данных и исключает доступ неуполномоченных лиц.",
          "8.2. Данные не передаются третьим лицам без согласия субъекта, за исключением случаев, предусмотренных законом.",
          "8.3. При неточностях Пользователь может направить уведомление на zakaz@aldetali.ru с пометкой «Актуализация персональных данных».",
          "8.4. Срок обработки определяется достижением целей либо отзывом согласия.",
          "8.5. Информация сторонних сервисов (например, Яндекс.Метрика) хранится и обрабатывается ими в соответствии с их политиками.",
          "8.6. Оператор обеспечивает конфиденциальность данных.",
        ],
      },
      {
        heading: "9. Перечень действий Оператора",
        paragraphs: [
          "Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу, обезличивание, блокирование, удаление и уничтожение данных, в том числе автоматизированную обработку.",
        ],
      },
      {
        heading: "10. Конфиденциальность персональных данных",
        paragraphs: [
          "Оператор и лица, получившие доступ к данным, обязаны не раскрывать их без согласия субъекта, если иное не предусмотрено законом.",
        ],
      },
      {
        heading: "11. Заключительные положения",
        items: [
          "11.1. По вопросам обработки персональных данных Пользователь может обратиться по адресу: zakaz@aldetali.ru.",
          "11.2. Актуальная версия Политики доступна по адресу: https://www.aldetali.com/privacy.",
          "11.3. Политика действует бессрочно до замены новой версией.",
        ],
      },
    ] satisfies Section[],
  },
  en: {
    sections: [
      {
        heading: "1. General provisions",
        paragraphs: [
          "This personal data processing policy is prepared in accordance with Federal Law No. 152-FZ of 27.07.2006 “On Personal Data” and defines the procedure for processing personal data and security measures taken by Andrey Skornyanu (hereinafter — the Operator).",
        ],
        items: [
          "1.1. The Operator’s primary goal is to respect human rights and freedoms when processing personal data.",
          "1.2. This Policy applies to all information the Operator may obtain about visitors of https://www.aldetali.com and is published at https://www.aldetali.com/privacy.",
        ],
      },
      {
        heading: "2. Key terms used in this Policy",
        items: [
          "2.1. Automated processing — processing using computing facilities.",
          "2.2. Blocking — temporary suspension of processing (except for clarification).",
          "2.3. Website — materials, software and databases available at https://www.aldetali.com.",
          "2.4. Personal data information system — databases and technologies that process personal data.",
          "2.5. Depersonalization — actions that make it impossible to identify a User.",
          "2.6. Processing — any operations with personal data.",
          "2.7. Operator — a person who processes personal data alone or jointly with others.",
          "2.8. Personal data — any information relating to a determined or determinable User of https://www.aldetali.com.",
          "2.9. User — any visitor of https://www.aldetali.com.",
          "2.10. Provision — disclosure to a specific person or group of persons.",
          "2.11. Distribution — disclosure to an indefinite group of persons.",
          "2.12. Cross-border transfer — transfer to a foreign state.",
          "2.13. Destruction — irreversible destruction of personal data.",
        ],
      },
      {
        heading: "3. Operator’s rights and duties",
        paragraphs: ["3.1. The Operator may:"],
        items: [
          "— obtain accurate information from the data subject;",
          "— continue processing without consent where allowed by law;",
          "— independently determine measures to fulfill personal data obligations.",
        ],
      },
      {
        heading: "3.2. The Operator shall:",
        items: [
          "— provide information upon the data subject’s request;",
          "— organize processing in accordance with Russian law;",
          "— respond to data subjects’ requests;",
          "— publish or provide access to this Policy;",
          "— take measures to protect personal data;",
          "— stop processing and destroy data where required by law.",
        ],
      },
      {
        heading: "4. Rights and duties of data subjects",
        paragraphs: ["4.1. Data subjects may:"],
        items: [
          "— obtain information about processing;",
          "— request clarification, blocking or destruction of data;",
          "— withdraw consent to processing;",
          "— appeal the Operator’s actions or omissions.",
        ],
      },
      {
        heading: "4.2. Data subjects shall:",
        items: [
          "— provide accurate personal data;",
          "— notify the Operator of changes to their data.",
        ],
      },
      {
        heading: "5. Principles of processing",
        items: [
          "5.1. Processing is lawful and fair.",
          "5.2. Processing is limited to specific lawful purposes.",
          "5.3. Only data relevant to the purposes is processed.",
          "5.4. The volume of data matches the stated purposes.",
          "5.5. Accuracy and relevance of data are ensured.",
          "5.6. Storage lasts no longer than required by the purposes.",
        ],
      },
      {
        heading: "6. Purposes of processing",
        paragraphs: [
          "Purpose: handling website requests submitted via forms, preparing commercial proposals, and contacting the user.",
          "Personal data: name / company name, phone number, email address, information from attached files (drawing / 3D model), technical data (IP address, User-Agent, date and time of the request).",
          "Legal basis: the data subject’s consent to personal data processing.",
          "Processing activities: collection, recording, systematization, accumulation, storage, clarification, extraction, use, deletion, destruction.",
        ],
      },
      {
        heading: "7. Conditions of processing",
        items: [
          "7.1. Processing is carried out with the data subject’s consent.",
          "7.2. Processing may also be carried out on other legal grounds provided by Russian law.",
        ],
      },
      {
        heading: "8. Collection, storage and transfer",
        items: [
          "8.1. The Operator safeguards data and prevents unauthorized access.",
          "8.2. Data is not transferred to third parties without consent, except as required by law.",
          "8.3. To correct inaccuracies, the User may email zakaz@aldetali.ru with the note “Personal data update”.",
          "8.4. Processing continues until the purposes are achieved or consent is withdrawn.",
          "8.5. Third-party services (e.g. Yandex.Metrika) process data under their own policies.",
          "8.6. The Operator ensures confidentiality of personal data.",
        ],
      },
      {
        heading: "9. Operator actions",
        paragraphs: [
          "The Operator performs collection, recording, systematization, accumulation, storage, clarification, extraction, use, transfer, depersonalization, blocking, deletion and destruction of data, including automated processing.",
        ],
      },
      {
        heading: "10. Confidentiality",
        paragraphs: [
          "The Operator and persons who obtain access to the data must not disclose it without the data subject’s consent, unless otherwise provided by law.",
        ],
      },
      {
        heading: "11. Final provisions",
        items: [
          "11.1. Questions about personal data processing: zakaz@aldetali.ru.",
          "11.2. The current version of this Policy is available at https://www.aldetali.com/privacy.",
          "11.3. This Policy remains in force indefinitely until replaced by a new version.",
        ],
      },
    ] satisfies Section[],
  },
} as const;

export function PrivacyPolicy() {
  const { locale } = useLanguage();
  const t = copy[locale] ?? copy.ru;

  return (
    <section className="relative bg-background py-14 lg:py-20">
      <Container className="max-w-3xl">
        <div className="space-y-9">
          {t.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-charcoal">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="mt-3 text-sm sm:text-[15px] leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
              {section.items && section.items.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item.slice(0, 64)}
                      className="text-sm sm:text-[15px] leading-relaxed text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
