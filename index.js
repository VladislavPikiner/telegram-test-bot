import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors())


const token = "5770493444:AAGV3rBllmsvXrOgpFKT8WHgztTLmA059x4";
const webAppUrl = "https://telegramtestwebapp.netlify.app/";


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

  

if(text === `Добрый день! 👋`){
await bot.sendMessage(chatId, 'Добрый день!', {
    reply_markup:{
            keyboard:[
                [{text: `🔏 Записаться на процедуру`, web_app: {url: webAppUrl + 'form'}}],
           
           
        ]
    }
})
await bot.sendMessage(chatId, 'Выберите одну из функций:', {
    reply_markup:{
        inline_keyboard:[
            
            [{text: "⭐ Оставить отзыв", web_app :{url: webAppUrl}}],
            [{text: "💫 Посмотреть отзывы", web_app: {url: webAppUrl}}],
        ]
    }
})
}

  if(msg?.web_app_data?.data){
    try {
        const data = JSON.parse(msg?.web_app_data?.data)
console.log(data)
        await bot.sendMessage(chatId, 'Запись успешно создана')
        await bot.sendMessage(chatId, "Ваша страна" + data.country + "\n Ваш город " + data.city)
       

        setTimeout(async()=>{
            await bot.sendMessage(chatId, 'Возникнут вопросы, звони: 0634748925')
        }, 3000)
    } catch (err) {
        console.error(err)
    }
}
});

app.post('/web-data', async (req, res)=>{
    const {queryId, products, totalPrice} = req.body;
try {
    await bot.answerWebAppQuery(queryId, {
        type:"article",
        id:queryId,
        title: "Успешная покупка",
        input_message_content:{message_text:'Спасибо что выбрали нас! Покупка на сумму ' + totalPrice}
    })
    return res.status(200).json({})
} catch (error) {
    console.error(error)

    await bot.answerWebAppQuery(queryId, {
        type:"article",
        id:queryId,
        title: "Не удалось приобрести товар",
        input_message_content:{message_text:"Возникла ошибка 😥 Повторите попытку"}

})
return res.status(500).json({})
}
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>console.log('Server started ' + PORT))