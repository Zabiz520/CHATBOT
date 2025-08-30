
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const fs = require('fs')
const path = require('path')

// Exportar opciones como variables 
const opciones1Path = path.join(__dirname, 'ARCHIVOS', 'OPCIONES1.txt');
let opciones1 = '';
try {
    opciones1 = fs.readFileSync(opciones1Path, 'utf8');
} catch (e) {
    opciones1 = 'No se encontraron opciones.';
}

const opcionesTramitePath = path.join(__dirname, 'ARCHIVOS', 'OPCIONES_TRAMITE.txt');
let opcionesTramite = '';
try {
    opcionesTramite = fs.readFileSync(opcionesTramitePath, 'utf8');
} catch (e) {
    opcionesTramite = 'No se encontraron opciones de trámite documentario.';
}


//flujos de trámite documentario
const flowContinua = addKeyword('1', { sensitive: true })
    .addAnswer('Has seleccionado Formación Continua.')
    .addAnswer("AQUI VA E PDF DE FC")
    .addAnswer(
    '📄 *Recuerda:*\n' +
    '*Todo trámite interno se inicia con la presentación del formato "Solicitud" debidamente llenada, la misma que será atendida en 4 días hábiles.*\n' +
    '*Así mismo para su atención, el alumno no deberá tener deudas ni cursos pendientes / desaprobados.*'
)
const flowIdiomas = addKeyword('2', { sensitive: true })
    .addAnswer('Has seleccionado Centro de Idiomas.')
    .addAnswer("AQUI VA E PDF DE IDIOMAS")
    .addAnswer(
    '📄 *Recuerda:*\n' +
    '*Todo trámite interno se inicia con la presentación del formato "Solicitud" debidamente llenada, la misma que será atendida en 4 días hábiles.*\n' +
    '*Así mismo para su atención, el alumno no deberá tener deudas ni cursos pendientes / desaprobados.*'
);
const flowCarreras = addKeyword('3', { sensitive: true })
    .addAnswer('Has seleccionado Carreras Profesionales.')
    .addAnswer("AQUI VA E PDF DE CARRERAS")
    .addAnswer(
    '📄 *Recuerda:*\n' +
    '*Todo trámite interno se inicia con la presentación del formato "Solicitud" debidamente llenada, la misma que será atendida en 4 días hábiles.*\n' +
    '*Así mismo para su atención, el alumno no deberá tener deudas ni cursos pendientes / desaprobados.*'
);

const flowTramiteDocumentario = addKeyword("1", {sensitive:true})
    .addAnswer('Has seleccionado la opción 1: Trámite Documentario.')
    .addAnswer(opcionesTramite, { capture: true }, async (ctx, { flowDynamic }) => {
        const match = ctx.body.match(/\d+/);
        const opcion = match ? match[0] : null;
        if (!["1", "2", "3"].includes(opcion)) {
            await flowDynamic('Esta no es una de las opciones. Por favor, elige una opción válida:');
            await flowDynamic(opcionesTramite);
        }
    },[flowCarreras, flowContinua, flowIdiomas])

// Flujo principal
const flowPrincipal = addKeyword([EVENTS.WELCOME])
    .addAnswer('¡Hola! 😊 Soy tu asistente virtual.')
    .addAnswer(opciones1, { capture: true }, async (ctx, { flowDynamic }) => {
        const match = ctx.body.match(/\d+/);
        const opcion = match ? match[0] : null;
        if (opcion !== '1') {
            await flowDynamic('Esta no es una de las opciones. Por favor, elige una opción válida:');
            await flowDynamic(opciones1);
        }
    }, flowTramiteDocumentario)


const main = async () => {
    const adapterDB = new JsonFileAdapter();
    const adapterFlow = createFlow([
        flowPrincipal
    ]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
