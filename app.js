const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const fs = require('fs')
const path = require('path')






const flowPrincipal = addKeyword([EVENTS.WELCOME])
    .addAnswer('¡Hola! 😊 Soy tu asistente virtual. ¿Me puedes decir tu nombre?', {
        capture: true,
    }, async (ctx, { flowDynamic, state, gotoFlow }) => {
        await state.update({ name: ctx.body })
        await flowDynamic('¡Gracias ' + ctx.body + '! 😊');
    },)
    .addAnswer('¿Qué opción te gustaría elegir?', null, async (_, { flowDynamic }) => {
        const opcionesPath = path.join(__dirname, 'ARCHIVOS', 'OPCIONES1.txt')
        let opciones = ''
        try {
            opciones = fs.readFileSync(opcionesPath, 'utf8')
        } catch (e) {
            opciones = 'No se encontraron opciones.'
        }
        await flowDynamic(opciones)
    })


const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
