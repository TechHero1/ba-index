var yonkoma = {
    ja: [

    ],
    en: [

    ],
    aoharu: [

    ],
    translations: [

    ]
}

var cur_serie;

async function procurarParam() {
    let searchParams = new URLSearchParams(window.location.search);
    cur_serie = searchParams.get('id');

    switch (cur_serie) {
        case "ja":
            //fetch ja
            let ja_fetch_object = await fetch("https://m19e.github.io/bluearchive-4panel/panels/ja.json");
            yonkoma.ja = await ja_fetch_object.json();
        break;
        case "en":
            //fetch en
            let en_fetch_object = await fetch("https://m19e.github.io/bluearchive-4panel/panels/en.json");
            yonkoma.en = await en_fetch_object.json();
        break;
        case "aoharu":
            //fetch aoharu
            let aoharu_fetch_object = await fetch("https://m19e.github.io/bluearchive-4panel/panels/aoharu.json");
            yonkoma.aoharu = await aoharu_fetch_object.json();
        break;
    }

    //fetch playable characters
    let playable_ja_fetch_object = await fetch("https://m19e.github.io/bluearchive-4panel/students/playable/ja.json");
    yonkoma.translations = await playable_ja_fetch_object.json();

    //fetch npcs
    let npc_ja_fetch_object = await fetch("https://m19e.github.io/bluearchive-4panel/students/npc/ja.json");
    yonkoma.translations = Object.assign(yonkoma.translations,await npc_ja_fetch_object.json());

    set_filter_default();
}

function set_filter_default() {
    let all_students = get_all_students_name("ja");
    let all_students_en = get_all_students_name("en",all_students);

    create_student_filters(all_students,all_students_en);

    loadContent();
}

function get_all_students_name(lang,names) {
    let result = [];
    if (lang == "ja") result = Object.keys(yonkoma.translations);
    else {
        for (const name of names) {
            students_selected.push(name);
            result.push(yonkoma.translations[name].en) ?? result.push(name);
        }
    }

    return result;
}

function create_student_filters(students_ja,students_en) {
    const container = document.querySelector(".filters");

    container.insertAdjacentHTML("beforeend", students_ja.map((ja, i) => `
        <a tabindex="-1" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-150 cursor-pointer" id="${ja}" onclick="switch_student('${ja}','${students_en[i]}-check')">${students_en[i]}<i class="float-right fa-regular fa-check-square filter-check-icon ${students_en[i]}-check"></i></a>
    `).join(""));
}

function loadContent() {
    const container = document.querySelector(".historia-conteudo");
    const chapters = yonkoma[cur_serie];
    const cards = [];

    for (const chapter of chapters) {
        //verifica se cap tem pelo menos alguma das estudantes do filtro
        const has_student = chapter.students.some(s => students_selected.includes(s));
        if (!has_student) continue;

        //titulo mostrado = se diferente de "No Title" ? true, pega do json : false, deixa vazio
        const chapter_title = chapter.title != "No Title" ? chapter.title : "";
        //titulo total = se ambos não forem vazios ? true, junta com traço : false, só junta (deixa vazio)
        const complete_title = (chapter.id != "" && chapter_title != "")
            ? chapter.id + " - " + chapter_title
            : chapter.id + chapter_title;

        let chapter_students = "";
        for (const student_ja of chapter.students) {
            //usa a key em japones pra pegar a tradução ?? mas se não tiver, continua com o japones
            const student_en = yonkoma.translations[student_ja]?.en ?? student_ja;

            chapter_students += `<span class="bg-white border border-gray-300 rounded-md shadow-md py-1 px-2 h-min w-fit break-keep text-base/9" onclick="switch_student('${student_ja}')">${student_en}</span>
            `;
        }

        cards.push(`
            <a class="h-[100%]" href="${chapter.href}" target="_blank">
                <div class="h-[100%] p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 cursor-pointer transition-all duration-150 group hover:bg-gray-200">
                    <div class="mb-2">${complete_title}</div>
                    ${chapter_students}
                </div>
            </a>
        `);
    }

    container.innerHTML = cards.join("");
}

var students_selected = [];

function switch_student(student,check_icon) {
    if (student == "none") {
        students_selected = [];

        document.querySelectorAll(".filter-check-icon").forEach(el => {
            el.classList.add("fa-square");
            el.classList.remove("fa-check-square");
        });
        loadContent();
        return;
    }
    if (student == "all") {
        students_selected = [];
        students_selected = get_all_students_name("ja");
        
        document.querySelectorAll(".filter-check-icon").forEach(el => {
            el.classList.add("fa-check-square");
            el.classList.remove("fa-square");
        });
        loadContent();
        return;
    }
    if (students_selected.includes(student)) {
        students_selected.splice(students_selected.indexOf(student), 1);
        document.querySelector("."+check_icon).classList.add("fa-square");
        document.querySelector("."+check_icon).classList.remove("fa-check-square");
        loadContent();
        return;
    }
    students_selected.push(student);
    document.querySelector("."+check_icon).classList.add("fa-check-square");
    document.querySelector("."+check_icon).classList.remove("fa-square");
    loadContent();
}

/*function translate_students(students) {
    let translated_students;
    let students_string;

    students_string = JSON.stringify(students);

    const all_translations = [
        ...Object.values(yonkoma.translations.playable),
        ...Object.values(yonkoma.translations.npc),
    ];

    for (const { ja, en } of all_translations) {
        students_string = students_string.replaceAll(`"${ja}"`, `"${en}"`);
    }

    translated_students = JSON.parse(students_string);

    return translated_students;
}*/

function switch_student_filter_dropdown() {
  if (document.querySelector(".student_filter_dropdown").classList.contains('hidden')) {
    document.querySelector(".student_filter_dropdown").classList.remove('hidden');
    return
  }
  document.querySelector(".student_filter_dropdown").classList.add('hidden');
}

window.addEventListener('click', function(e){   
  if (!document.querySelector('.student_filter_dropdown_area').contains(e.target)){
    document.querySelector(".student_filter_dropdown").classList.add('hidden');
  }
});
