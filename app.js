// --- قاعدة بيانات اللاعبين (النجوم) ---
const allStars = [
    // أساطير وتاريخيين
    "ليونيل ميسي", "كريستيانو رونالدو", "مارادونا", "بيليه", "زيدان", "رونالدينيو", "رونالدو الظاهرة", "يوهان كرويف", "مالديني", "بوفون", 
    "إنييستا", "تشافي", "بيرلو", "كاكا", "روبيرتو كارلوس", "هنري", "بيكهام", "جيرارد", "لامبارد", "توتي", "ديل بييرو", "بويول",
    "نيدفيد", "كانافارو", "شيفشينكو", "فان باستن", "ايتو", "دروجبا", "باتيستوتا", "راؤول غونزاليس", "كاسياس", "نوير",
    // نجوم حاليين - الدوري الإنجليزي
    "صلاح", "هالاند", "دي بروين", "ساكا", "أوديجارد", "رايس", "فودين", "رودري", "فان دايك", "سون", "برناردو سيلفا", "راشفورد",
    "برونو فيرنانديز", "أليسون", "إيدرسون", "جيمس", "ألكسندر أرنولد", "مودريك", "إنزو فيرنانديز", "واتكينز", "توني",
    // نجوم حاليين - الدوري الإسباني
    "مبابي", "فينيسيوس", "بيلينجهام", "مودريتش", "فالفيردي", "ليفاندوفسكي", "لامين يامال", "غريزمان", "بيدري", "جافي", "رودريغو",
    "كورتوا", "أراوخو", "دي يونغ", "غوندوغان", "نيكو ويليامز", "براهيم دياز", "كارفخال", "ميليتاو", "كامافينجا",
    // نجوم حاليين - بقية الدوريات
    "هاري كين", "موسيالا", "فيرتز", "ديفيز", "كيميتش", "لويتارو مارتينيز", "قاسم بهدلي", "لياو", "ثيو هيرنانديز", "أوسيمين",
    "حكيمي", "ديمبيلي", "دوناروما", "بونو", "تشارلحان أوغلو", "دي ماريا", "ديبالا", "لوكاكو", "كفاراتسخيليا",
    // إضافة المزيد للوصول لـ 400 (تكرار منوع وتصنيفات)
    "كانتي", "بنزيمة", "نيمار", "رياض محرز", "ماني", "ميتروفيتش", "فيرمينو", "سافيتش", "فري", "كوليبالي", "لابورت",
    "سالم الدوسري", "عمر السومة", "أكرم عفيف", "موسى التعمري", "أمرابط", "زياش", "أشرف حكيمي", "منير المحمدي"
    // ملاحظة: يمكنك الاستمرار بإضافة الأسماء داخل هذه المصفوفة بسهولة
];

// --- حالة اللعبة (State) ---
let state = {
    players: JSON.parse(localStorage.getItem('players')) || [],
    secretWord: "",
    spyIndex: -1,
    currentTurn: 0,
    revealed: false
};

// --- محرك العرض (UI Engine) ---
function render() {
    const app = document.getElementById('app');
    
    // الشاشة 1: إضافة اللاعبين
    if (state.spyIndex === -1) {
        app.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-center mb-6 text-white border-b-4 border-red-600 pb-2">سالفة كروية ⚽</h1>
                <div class="space-y-4">
                    <input id="pName" type="text" class="w-full p-4 rounded-2xl bg-slate-700 text-white border-2 border-blue-500 focus:outline-none" placeholder="اكتب اسم اللاعب...">
                    <button onclick="addPlayer()" class="btn-blue w-full py-4 text-white font-bold rounded-2xl shadow-lg">إضافة لاعب +</button>
                    
                    <div class="bg-slate-900/50 p-4 rounded-2xl max-h-48 overflow-y-auto">
                        <p class="text-slate-400 text-sm mb-2 text-center">اللاعبين المسجلين (${state.players.length})</p>
                        <div class="grid grid-cols-2 gap-2">
                            ${state.players.map((p, i) => `<div class="p-2 bg-slate-700 rounded-xl text-center text-sm font-bold flex justify-between px-3"><span>${p}</span><span class="text-red-500" onclick="removePlayer(${i})">×</span></div>`).join('')}
                        </div>
                    </div>
                    
                    <button onclick="startGame()" class="btn-red w-full py-4 text-white font-bold rounded-2xl text-xl shadow-red-900/20 shadow-xl">ابدأ التوزيع 🚀</button>
                    <button onclick="clearPlayers()" class="w-full text-slate-500 text-xs underline">مسح كل الأسماء</button>
                </div>
            </div>
        `;
    } 
    // الشاشة 2: دور اللاعب (إخفاء)
    else if (state.currentTurn < state.players.length) {
        app.innerHTML = `
            <div class="fade-in text-center py-10">
                <div class="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/50">👤</div>
                <h2 class="text-xl text-slate-400 mb-2">مرر الجهاز إلى:</h2>
                <h3 class="text-4xl font-bold mb-10 text-white">${state.players[state.currentTurn]}</h3>
                
                ${!state.revealed ? 
                    `<button onclick="reveal()" class="btn-blue w-full py-8 text-white font-bold rounded-[2rem] text-2xl shadow-2xl animate-pulse">اضغط لرؤية الكلمة</button>` :
                    `<div class="p-8 rounded-[2rem] ${state.currentTurn === state.spyIndex ? 'bg-red-theme' : 'bg-blue-900/50 border-2 border-blue-500'} mb-8 shadow-inner">
                        <p class="text-slate-300 mb-2">${state.currentTurn === state.spyIndex ? 'مهمتك:' : 'اسم اللاعب:'}</p>
                        <h4 class="text-4xl font-black">${state.currentTurn === state.spyIndex ? "⚠️ أنت الجاسوس" : state.secretWord}</h4>
                    </div>
                    <button onclick="nextPlayer()" class="bg-white text-slate-900 w-full py-5 font-black rounded-2xl text-xl hover:bg-slate-200">فهمت، اخفي الكلمة ✅</button>`
                }
            </div>
        `;
    }
}

// --- الوظائف (Functions) ---

function addPlayer() {
    const input = document.getElementById('pName');
    if (input.value.trim()) {
        state.players.push(input.value.trim());
        localStorage.setItem('players', JSON.stringify(state.players));
        input.value = "";
        render();
    }
}

function removePlayer(index) {
    state.players.splice(index, 1);
    localStorage.setItem('players', JSON.stringify(state.players));
    render();
}

function clearPlayers() {
    state.players = [];
    localStorage.removeItem('players');
    render();
}

function startGame() {
    if (state.players.length < 3) {
        alert("يا بطل، لازم على الأقل 3 لاعبين حتى تصير السالفة حلوة!");
        return;
    }
    state.spyIndex = Math.floor(Math.random() * state.players.length);
    state.secretWord = allStars[Math.floor(Math.random() * allStars.length)];
    state.currentTurn = 0;
    state.revealed = false;
    render();
}

function reveal() {
    state.revealed = true;
    render();
}

function nextPlayer() {
    state.revealed = false;
    state.currentTurn++;
    if (state.currentTurn >= state.players.length) {
        // نهاية التوزيع
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="fade-in text-center py-10">
                <div class="text-6xl mb-6">🏁</div>
                <h2 class="text-3xl font-bold mb-4 text-white">انتهى التوزيع!</h2>
                <p class="text-slate-400 mb-8 leading-relaxed">الآن ابدأوا الكلام، وعلى الجاسوس أن يكتشف من هو اللاعب المختفي دون أن ينكشف!</p>
                <button onclick="resetGame()" class="btn-blue w-full py-4 text-white font-bold rounded-2xl">لعبة جديدة 🔄</button>
            </div>
        `;
    } else {
        render();
    }
}

function resetGame() {
    state.spyIndex = -1;
    state.currentTurn = 0;
    state.revealed = false;
    render();
}

// تشغيل عند التحميل
render();
