// 레벨 테스트. type: "listen"(문장을 듣고 뜻 고르기) | "pick"(가장 자연스러운 영어 고르기)
// w: 가중치(난이도)
window.LEVEL_TEST = [
{type:"listen", w:1, say:"Could you say that again?", opts:["다시 말해 주시겠어요?","거기 가 봤어요?","같이 갈래요?"], a:0},
{type:"pick", w:1, ko:"만나서 반가워요.", opts:["Nice meeting to you.","Nice to meet you.","Glad meet you."], a:1},
{type:"listen", w:1, say:"I'm running a little late.", opts:["조금 뛰고 있어요.","조금 늦을 것 같아요.","조금 일찍 왔어요."], a:1},
{type:"pick", w:1, ko:"주말 어떻게 보냈어?", opts:["How did you spend weekend?","What was your weekend?","How was your weekend?"], a:2},
{type:"listen", w:2, say:"Do you mind if I open the window?", opts:["창문 좀 열어 주실래요?","창문 열어도 될까요?","창문 열려 있었어요?"], a:1},
{type:"pick", w:2, ko:"매운 음식에 익숙하지 않아요.", opts:["I'm not used to spicy food.","I'm not use to eat spicy food.","I don't used to spicy food."], a:0},
{type:"listen", w:2, say:"It slipped my mind.", opts:["미끄러질 뻔했어요.","마음이 바뀌었어요.","깜빡했어요."], a:2},
{type:"pick", w:2, ko:"우리 내일 다시 얘기하는 게 어때요?", opts:["Why don't we talk about it tomorrow?","Why we don't talk tomorrow about it?","How about we talking tomorrow?"], a:0},
{type:"listen", w:3, say:"I was wondering if we could push the meeting back a bit.", opts:["회의를 조금 미룰 수 있을까 해서요.","회의를 조금 앞당길 수 있을까요?","회의가 왜 미뤄졌는지 궁금했어요."], a:0},
{type:"pick", w:3, ko:"일찍 출발했어야 했는데.", opts:["I must leave earlier.","I should have left earlier.","I should leave earlier before."], a:1},
{type:"listen", w:3, say:"By the time we got there, the store had already closed.", opts:["우리가 도착했을 때 가게는 이미 문을 닫았다.","가게가 문 닫기 전에 도착했다.","가게가 곧 문을 닫을 예정이었다."], a:0},
{type:"pick", w:3, ko:"(동료에게) 그 부분은 제가 맡을게요.", opts:["I will charge that part.","I can handle that part.","That part is my take."], a:1}
];
