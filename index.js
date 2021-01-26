//Importaciones
var express = require('express');
const Telegram = require('node-telegram-bot-api');
const token = '1509790910:AAG8OeiLDgRvT_XuJ8V43ajoe5e0m34qEgg';
const tokenBetas = '1589713084:AAGGTRjGxXZckZ_J81medeHeXkvOAtXXmjY';
const bot = new Telegram(token, { polling: true });
const fs = require('fs');

// Server
var App = express();
var port = process.env.PORT || 3000;
var options = {
	root: __dirname
};

// Pagina plantilla del servicio
function getHTML(req, res) {
	res.sendFile('./index.html', options, (err) => {
		if (err) throw err;
		console.log('Sirviendo index.html');
	});
}

// Rutas y Backup
App.get('/', getHTML);

App.get('/backup', function(req, res) {
	post_data_cursos = JSON.stringify(data_cursos);
	res.setHeader('Content-disposition', 'attachment; filename=links.json');
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	res.write(post_data_cursos);
	res.end();
});
App.get('/backup2', function(req, res) {
	post_data_usuarios = JSON.stringify(data_usuarios);
	res.setHeader('Content-disposition', 'attachment; filename=users.json');
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	res.write(post_data_usuarios);
	res.end();
});

//Data Interna
let pre_data_cursos;
let data_cursos;
let post_data_cursos;

let pre_data_usuarios;
let data_usuarios;
let post_data_usuarios;

const cargar = () => {
	pre_data_cursos = fs.readFileSync('links.json');
	data_cursos = JSON.parse(pre_data_cursos);
	pre_data_usuarios = fs.readFileSync('users.json');
	data_usuarios = JSON.parse(pre_data_usuarios);
};

setTimeout(() => {
	cargar();
}, 0);

//Inicio del bot ************
bot.on('text', (msg) => {
	let user_id = msg.from.id;
	let user_nick = msg.from.first_name;

	const user_actual = data_usuarios.find((u) => u.id == user_id);
	if (user_actual === undefined) {
		data_usuarios.push({
			id: user_id,
			code: '',
			section: '',
			l_meets: 1,
			l_add: 1
		});
	}

	const operaciones_usuario = (op_code, op_section, op_add, op_meets) => {
		data_usuarios.forEach((e) => {
			if (e.id == user_id) {
				if (op_code != null) {
					e.code = op_code;
				} else if (op_code == 0) {
					e.code = '';
				}

				if (op_section != null) {
					e.section = op_section;
				} else if (op_section == 0) {
					e.section = '';
				}

				if (op_add != null) {
					if (op_add == +1) {
						e.l_add += 1;
					} else if (op_add == -1) {
						e.l_add -= 1;
					} else if (op_add == 0) {
						e.l_add = 1;
					}
				}

				if (op_meets != null) {
					if (op_meets == +1) {
						e.l_meets += 1;
					} else if (op_meets == -1) {
						e.l_meets -= 1;
					} else if (op_meets == 0) {
						e.l_meets = 1;
					}
				}
			}
		});
	};

	const limpiar = () => {
		operaciones_usuario(0, 0, 0, 0);
	};

	const buscar_seccion_add = () => {
		data_cursos.forEach((e) => {
			if (e.codigo == user_actual.code) {
				e.mas.forEach((y) => {
					bot.sendMessage(user_id, `/add_seccion_${y.seccion} <-`);
				});
			}
		});
		operaciones_usuario(null, null, 0, null);
	};

	const buscar_seccion_meet = () => {
		data_cursos.forEach((e) => {
			if (e.codigo == user_actual.code) {
				e.mas.forEach((y) => {
					if (y.link.length != 0) {
						bot.sendMessage(user_id, `/meet_seccion_${y.seccion} <-`);
					}
				});
			}
		});
		operaciones_usuario(null, null, null, 0);
	};

	switch (msg.text) {
		case '/start':
			bot.sendMessage(
				user_id,
				`Bot basico dedicado a Recopilar Meets para los cursos de Ingenieria Usac

		Comienza haciendo clic en -> /help

		Preguntas Frecuentes en -> /dudas

			-Rauqoz
			-Maoz
			`
			);
			break;
		case '/addlink':
		case '/mas_addlink':
		case '/menos_addlink':
			bot.sendMessage(user_id, 'Escoge el Curso al cual quieres Agregar el Link de Meet (Unicamente de Meet) **');
			if (msg.text == '/mas_addlink') {
				operaciones_usuario(null, null, 1, null);
			} else if (msg.text == '/menos_addlink') {
				operaciones_usuario(null, null, -1, null);
			} else if (msg.text == '/addlink') {
				operaciones_usuario(null, null, 0, null);
			}
			//listado add
			if (user_actual.l_add == 1) {
				bot.sendMessage(
					user_id,
					`
	/add_ADMINISTRACION_DE_EMPRESAS_1
	/add_ADMINISTRACION_DE_EMPRESAS_1_DIPLO
	/add_ADMINISTRACION_DE_EMPRESAS_2
	/add_ADMINISTRACION_DE_EMPRESAS_2_DIPLO
	/add_ADMINISTRACION_DE_PERSONAL
	/add_ADMINISTRACION_DE_PERSONAL_DIPLO
	/add_AGUAS_SUBTERRANEAS
	/add_ALTA_TENSION
	/add_ANALISIS_CUALITATIVO
	/add_ANALISIS_DE_SISTEMAS_DE_POTENCIA_1
	/add_ANALISIS_DE_SISTEMAS_INDUSTRIALES
	/add_ANALISIS_DE_SISTEMAS_INDUSTRIALES_DIPLO
	/add_ANALISIS_ESTRUCTURAL
	/add_ANALISIS_ESTRUCTURAL_1
	/add_ANALISIS_INSTRUMENTAL
	/add_ANALISIS_MECANICO
	/add_ANALISIS_PROBABILISTICO
	/add_ANALISIS_Y_DISENO_DE_SISTEMAS_1
	/add_ANALISIS_Y_DISENO_DE_SISTEMAS_2
	/add_AREA_MATEMATICA_BASICA_1
	/add_AREA_MATEMATICA_BASICA_2
	/add_AREA_MATEMATICA_INTERMEDIA_1
	/add_AREA_MATEMATICA_INTERMEDIA_2
	/add_AREA_MATEMATICA_INTERMEDIA_3
	/add_AREA_SOCIAL_HUMANISTICA_1
	/add_AREA_SOCIAL_HUMANISTICA_2
	/add_AREA_TECNICA_COMPLEMENTARIA_1
	/add_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_1
	/add_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_2
	/add_AUTOMATIZACION_INDUSTRIAL
	/add_BALANCE_DE_MASA_Y_ENERGIA
	/add_BIOINGENIERIA_1
	/add_BIOLOGIA
	/add_CALIDAD_DEL_AGUA
	/add_CALIDAD_DEL_AIRE
	/add_CIENCIA_DE_LOS_MATERIALES
	/add_CIMENTACIONES_1
	/add_CIMENTACIONES_2
	/add_CINETICA_DE_PROCESOS_QUIMICOS
	/add_CIRCUITOS_ELECTRICOS_1
	/add_CIRCUITOS_ELECTRICOS_2
	/add_COMUNICACIONES_1
	/add_COMUNICACIONES_2
	/add_COMUNICACIONES_3
	/add_COMUNICACIONES_4
	
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 2) {
				bot.sendMessage(
					user_id,
					`
	/add_CONCRETO_ARMADO_1
	/add_CONCRETO_ARMADO_2
	/add_CONCRETO_PREESFORZADO
	/add_CONTABILIDAD_1
	/add_CONTABILIDAD_2
	/add_CONTABILIDAD_3
	/add_CONTROL_DE_CONTAMINANTES_INDUSTRIALES
	/add_CONTROL_DE_LA_PRODUCCION
	/add_CONTROLES_INDUSTRIALES
	/add_CONVERSION_DE_ENERGIA_ELECTROMECANICA_1
	/add_CONVERSION_DE_ENERGIA_ELECTROMECANICA_2
	/add_COSTOS_PRESUPUESTOS_Y_AVALUOS
	/add_CURSO_PREPARATORIO_IDIOMA_TECNICO
	/add_DEPORTES_1
	/add_DIBUJO_CONSTRUCTIVO_PARA_INGENIERIA
	/add_DIBUJO_TECNICO_MECANICO
	/add_DIPLO_ADMINISTRACION_Y_COMPETENCIAS
	/add_DIPLO_APLICACION_DE_LA_NORMA_ISO_21500
	/add_DIPLO_BUENAS_PRACTICAS_DE_MAN_EN_LA_IND_FARMA_Y_ALIMENTICIA
	/add_DIPLO_EMPRESA_Y_SOCIEDADES_MERCANTILES
	/add_DIPLO_EN_ACONDICIONAMIENTO_DEL_AGUA_EN_LA_INDUSTRIA
	/add_DIPLO_EN_ADMINISTRACION_DE_CALIDAD_INDUSTRIA_ALIMENTICIA
	/add_DIPLO_EN_GESTION_GERENCIAL_DE_OPERACIONES
	/add_DIPLO_EN_LIDERAZGO_DEL_TALENTO_HUMANO
	/add_DIPLO_EN_RECURSOS_HUMANOS
	/add_DIPLO_EN_VALUACION_INMOBILIARIA
	/add_DIPLO_FORMULACION_Y_EVALUACION_DE_PROYECTOS
	/add_DIPLO_MANTENIMIENTO_INDUSTRIAL
	/add_DIPLO_SEGURIDAD_INDUSTRIAL_Y_SALUD_OCUPACIONAL
	/add_DISENO_DE_EQUIPO
	/add_DISENO_DE_ESTRUCTURAS_EN_MAMPOSTERIA
	/add_DISENO_DE_ESTRUCTURAS_METALICAS_1
	/add_DISENO_DE_MAQUINAS_1
	/add_DISENO_DE_MAQUINAS_2
	/add_DISENO_DE_MAQUINAS_3
	/add_DISENO_DE_PLANTAS
	/add_DISENO_ESTRUCTURAL
	/add_DISENO_ESTRUCTURAL_1
	/add_DISENO_PARA_LA_PRODUCCION
	/add_ECOLOGIA
	/add_ECONOMIA
	/add_ECONOMIA_INDUSTRIAL
	/add_ECONOMIA_INDUSTRIAL_DIPLO
	/add_ELECTRICIDAD_Y_ELECTRONICA_BASICA
	/add_ELECTRONICA_1
	
	
	<- /menos_addlink
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 3) {
				bot.sendMessage(
					user_id,
					`
	/add_ELECTRONICA_2
	/add_ELECTRONICA_3
	/add_ELECTRONICA_4
	/add_ELECTRONICA_5
	/add_ELECTRONICA_6
	/add_ELECTRONICA_APLICADA_2
	/add_EMPRENDEDORES_DE_NEGOCIOS_INFORMATICOS
	/add_ESTADISTICA_1
	/add_ESTADISTICA_2
	/add_ESTRUCTURAS_DE_DATOS
	/add_ETICA_PROFESIONAL
	/add_EXTRACCIONES_INDUSTRIALES
	/add_FILOSOFIA_DE_LA_CIENCIA
	/add_FISICA_1
	/add_FISICA_2
	/add_FISICA_3
	/add_FISICA_4
	/add_FISICA_BASICA
	/add_FISICO_QUIMICA_1
	/add_FISICO_QUIMICA_2
	/add_FLUJO_DE_FLUIDOS
	/add_GEOGRAFIA
	/add_GEOLOGIA
	/add_GEOLOGIA_DEL_PETROLEO
	/add_GEOLOGIA_ESTRUCTURAL
	/add_GESTION_DE_DESASTRES
	/add_GESTION_TOTAL_DE_LA_CALIDAD
	/add_HIDRAULICA
	/add_HIDRAULICA_DE_CANALES
	/add_HIDROLOGIA
	/add_IDIOMA_TECNICO_1
	/add_IDIOMA_TECNICO_2
	/add_IDIOMA_TECNICO_3
	/add_IDIOMA_TECNICO_4
	/add_INGENIERIA_DE_LA_PRODUCCION
	/add_INGENIERIA_DE_METODOS
	/add_INGENIERIA_DE_PLANTAS
	/add_INGENIERIA_DE_TRANSITO_Y_TRANSPORTES
	/add_INGENIERIA_DEL_AZUCAR
	/add_INGENIERIA_ECONOMICA_1
	/add_INGENIERIA_ECONOMICA_2
	/add_INGENIERIA_ECONOMICA_3
	/add_INGENIERIA_ELECTRICA_1
	/add_INGENIERIA_ELECTRICA_2
	/add_INGENIERIA_SANITARIA_1
	
		
	<- /menos_addlink
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 4) {
				bot.sendMessage(
					user_id,
					`	
	/add_INGENIERIA_SANITARIA_2
	/add_INGENIERIA_TEXTIL_1
	/add_INSTALACION_DE_EQUIPOS_ELECTRONICOS
	/add_INSTALACIONES_ELECTRICAS
	/add_INSTALACIONES_ELECTRICAS_CIVIL
	/add_INSTALACIONES_MECANICAS
	/add_INSTRUMENTACION_ELECTRICA
	/add_INSTRUMENTACION_MECANICA
	/add_INTELIGENCIA_ARTIFICIAL_1
	/add_INTRO_A_LA_GESTION_TECNOLOGICA
	/add_INTROD_AL_ESTUDIO_DE_IMPACTO_AMBIENTAL
	/add_INTROD_DE_PROYECTOS_GERENCIALES
	/add_INTRODUCCION_A_LA_PROGRAMACION_DE_COMPUTADORAS
	/add_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_1
	/add_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_2
	/add_INVESTIGACION_1
	/add_INVESTIGACION_DE_OPERACIONES_I
	/add_INVESTIGACION_DE_OPERACIONES_II
	/add_IQ_3_TRANSFERENCIA_DE_CALOR
	/add_IQ_4_TRANSFERENCIA_DE_MASA
	/add_IQ_5_TRANSFERENCIA_DE_MASA_EN_UNIDADES_CONTINUAS
	/add_LABORATORIO_DE_INGENIERIA_QUIMICA_1
	/add_LABORATORIO_DE_INGENIERIA_QUIMICA_2
	/add_LEGISLACION_1
	/add_LEGISLACION_1_DIPLO
	/add_LEGISLACION_2
	/add_LEGISLACION_2_DIPLO
	/add_LEGISLACION_AMBIENTAL_1
	/add_LENGUAJES_DE_PROGRAMACION_APLICADOS_AIE
	/add_LENGUAJES_FORMALES_Y_DE_PROGRAMACION
	/add_LINEAS_DE_TRANSMISION
	/add_LOGICA_DE_SISTEMAS
	/add_MANEJO_E_IMPLEMENTACION_DE_ARCHIVOS
	/add_MANTENIMIENTO_DE_HOSPITALES_1
	/add_MANTENIMIENTO_DE_HOSPITALES_2
	/add_MAQUINAS_ELECTRICAS
	/add_MAQUINAS_HIDRAULICAS
	/add_MATEMATICA_APLICADA_1
	/add_MATEMATICA_APLICADA_1_DIPLO
	/add_MATEMATICA_APLICADA_2
	/add_MATEMATICA_APLICADA_2_DIPLO
	/add_MATEMATICA_APLICADA_3
	/add_MATEMATICA_APLICADA_3_DIPLO
	/add_MATEMATICA_APLICADA_4
	/add_MATEMATICA_APLICADA_5
	
	
	<- /menos_addlink
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 5) {
				bot.sendMessage(
					user_id,
					`		
	/add_MATEMATICA_APLICADA_5_DIPLO
	/add_MATEMATICA_PARA_COMPUTACION_1
	/add_MATEMATICA_PARA_COMPUTACION_2
	/add_MATERIALES_DE_CONSTRUCCION
	/add_MATERIALES_DE_CONSTRUCCION_1
	/add_MATERIALES_DE_CONSTRUCCION_2
	/add_MECANICA_ANALITICA_1
	/add_MECANICA_ANALITICA_2
	/add_MECANICA_DE_FLUIDOS
	/add_MECANICA_DE_SUELOS_1
	/add_MECANISMOS
	/add_MERCADOTECNIA_1
	/add_METALURGIA_Y_METALOGRAFIA
	/add_METODOS_DE_CONSTRUCCION
	/add_MICROBIOLOGIA
	/add_MICROECONOMIA
	/add_MODELACION_Y_SIMULACION_1
	/add_MODELACION_Y_SIMULACION_2
	/add_MONTAJE_Y_MANTENIMIENTO_DE_EQUIPO
	/add_MOTORES_DE_COMBUSTION_INTERNA
	/add_OPERACIONES_Y_PROCESOS_EN_LA_INDUSTRIA_FARMACEUTICA
	/add_ORGANIZACION_COMPUTACIONAL
	/add_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_1
	/add_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_2
	/add_PAP_DE_MATEMATICA_PARA_INGENIERIA
	/add_PAVIMENTOS
	/add_PLANEAMIENTO
	/add_PLANEAMIENTO_DIPLO
	/add_PLANTAS_DE_VAPOR
	/add_PRACTICAS_FINALES_INGENIERIA_AMBIENTAL
	/add_PRACTICAS_FINALES_INGENIERIA_CIENCIAS_Y_SISTEMAS
	/add_PRACTICAS_FINALES_INGENIERIA_CIVIL
	/add_PRACTICAS_FINALES_INGENIERIA_ELECTRICA
	/add_PRACTICAS_FINALES_INGENIERIA_ELECTRONICA
	/add_PRACTICAS_FINALES_INGENIERIA_INDUSTRIAL
	/add_PRACTICAS_FINALES_INGENIERIA_MECANICA
	/add_PRACTICAS_FINALES_INGENIERIA_MECANICA_ELECTRICA
	/add_PRACTICAS_FINALES_INGENIERIA_MECANICA_INDUSTRIAL
	/add_PRACTICAS_FINALES_INGENIERIA_QUIMICA
	/add_PRACTICAS_INICIALES
	/add_PRACTICAS_INTERMEDIAS
	/add_PREPARACION_Y_EVALUACION_DE_PROYECTOS_1
	/add_PREPARACION_Y_EVALUACION_DE_PROYECTOS_2
	/add_PRINCIPIOS_DE_METROLOGIA
	/add_PROCESOS_DE_MANUFACTURA_1
	
	
	<- /menos_addlink
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 6) {
				bot.sendMessage(
					user_id,
					`		
	/add_PROCESOS_DE_MANUFACTURA_2
	/add_PROCESOS_QUIMICOS_INDUSTRIALES
	/add_PROGRAMACION_COMERCIAL_1
	/add_PROGRAMACION_DE_COMPUTADORAS_1
	/add_PROGRAMACION_DE_COMPUTADORAS_2
	/add_PROTECCION_DE_SISTEMAS_DE_POTENCIA
	/add_PROYECTOS_DE_COMPUTACION_APLICADA_AIE
	/add_PSICOLOGIA_INDUSTRIAL
	/add_PSICOLOGIA_INDUSTRIAL_DIPLO
	/add_PUENTES
	/add_QUIMICA_2
	/add_QUIMICA_3
	/add_QUIMICA_AMBIENTAL
	/add_QUIMICA_GENERAL_1
	/add_QUIMICA_ORGANICA_2
	/add_QUIMICA_PARA_INGENIERIA_CIVIL
	/add_RADIOCOMUNICACIONES_TERRESTRES
	/add_REDES_DE_COMPUTADORAS_1
	/add_REDES_DE_COMPUTADORAS_2
	/add_REFRIGERACION_Y_AIRE_ACONDICIONADO
	/add_RESISTENCIA_DE_MATERIALES_1
	/add_RESISTENCIA_DE_MATERIALES_2
	/add_ROBOTICA
	/add_SANEAMIENTO_AMBIENTAL
	/add_SEGURIDAD_E_HIGIENE_INDUSTRIAL
	/add_SEMINARIO_DE_INVESTIGACION
	/add_SEMINARIO_DE_INVESTIGACION_AMBIENTAL
	/add_SEMINARIO_DE_INVESTIGACION_CIVIL
	/add_SEMINARIO_DE_INVESTIGACION_ELECTRICA
	/add_SEMINARIO_DE_INVESTIGACION_ELECTRONICA
	/add_SEMINARIO_DE_INVESTIGACION_EPS
	/add_SEMINARIO_DE_INVESTIGACION_INDUSTRIAL
	/add_SEMINARIO_DE_INVESTIGACION_MECANICA
	/add_SEMINARIO_DE_INVESTIGACION_MECANICA_ELECTRICA
	/add_SEMINARIO_DE_INVESTIGACION_MECANICA_INDUSTRIAL
	/add_SEMINARIO_DE_INVESTIGACION_QUIMICA
	/add_SEMINARIO_DE_SISTEMAS_2
	/add_SEMINARIO_DE_SISTEMAS_I
	/add_SEPARACION_POR_MEDIO_DE_MEMBRANAS_SELECTIVAS
	/add_SISTEMAS_DE_BASES_DE_DATOS_1
	/add_SISTEMAS_DE_BASES_DE_DATOS_2
	/add_SISTEMAS_DE_CONTROL_1
	/add_SISTEMAS_DE_GENERACION
	/add_SISTEMAS_OPERATIVOS_1
	/add_SISTEMAS_OPERATIVOS_2
	
		
	<- /menos_addlink
	
	/mas_addlink ->
	`
				);
			} else if (user_actual.l_add == 7) {
				bot.sendMessage(
					user_id,
					`		
	/add_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_1
	/add_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_2
	/add_SOFTWARE_AVANZADO
	/add_SUBESTACIONES
	/add_TALLER_DE_SIST_DE_INF_GEOGRAFICA
	/add_TECNICAS_DE_ESTUDIO_E_INVESTIGACION
	/add_TECNOLOGIA_DE_LOS_ALIMENTOS
	/add_TELECOMUNICACIONES_Y_REDES_LOCALES
	/add_TEORIA_DE_SISTEMAS_1
	/add_TEORIA_DE_SISTEMAS_2
	/add_TEORIA_ELECTROMAGNETICA_1
	/add_TEORIA_ELECTROMAGNETICA_2
	/add_TERMODINAMICA_1
	/add_TERMODINAMICA_2
	/add_TERMODINAMICA_3
	/add_TERMODINAMICA_4
	/add_TIPOLOGIA_ESTRUCTURAL
	/add_TOPOGRAFIA_1
	/add_TOPOGRAFIA_2
	/add_TOPOGRAFIA_3
	/add_TRANSMISION_Y_DISTRIBUCION
	/add_VIAS_TERRESTRES_1
	/add_VIAS_TERRESTRES_2
	/add_VIBRACIONES
	
		
	<- /menos_addlink
	`
				);
			} else {
				bot.sendMessage(user_id, 'Escribe /addlink');
				operaciones_usuario(null, null, 0, null);
			}

			break;
		case '/meet':
		case '/mas_meets':
		case '/menos_meets':
			bot.sendMessage(user_id, 'Escoge el Curso del cual quieres Ver el Meet **');
			if (msg.text == '/mas_meets') {
				operaciones_usuario(null, null, null, 1);
			} else if (msg.text == '/menos_meets') {
				operaciones_usuario(null, null, null, -1);
			} else if (msg.text == '/meet') {
				operaciones_usuario(null, null, null, 0);
			}
			//listado meet
			if (user_actual.l_meets == 1) {
				bot.sendMessage(
					user_id,
					`
	/meet_ADMINISTRACION_DE_EMPRESAS_1
	/meet_ADMINISTRACION_DE_EMPRESAS_1_DIPLO
	/meet_ADMINISTRACION_DE_EMPRESAS_2
	/meet_ADMINISTRACION_DE_EMPRESAS_2_DIPLO
	/meet_ADMINISTRACION_DE_PERSONAL
	/meet_ADMINISTRACION_DE_PERSONAL_DIPLO
	/meet_AGUAS_SUBTERRANEAS
	/meet_ALTA_TENSION
	/meet_ANALISIS_CUALITATIVO
	/meet_ANALISIS_DE_SISTEMAS_DE_POTENCIA_1
	/meet_ANALISIS_DE_SISTEMAS_INDUSTRIALES
	/meet_ANALISIS_DE_SISTEMAS_INDUSTRIALES_DIPLO
	/meet_ANALISIS_ESTRUCTURAL
	/meet_ANALISIS_ESTRUCTURAL_1
	/meet_ANALISIS_INSTRUMENTAL
	/meet_ANALISIS_MECANICO
	/meet_ANALISIS_PROBABILISTICO
	/meet_ANALISIS_Y_DISENO_DE_SISTEMAS_1
	/meet_ANALISIS_Y_DISENO_DE_SISTEMAS_2
	/meet_AREA_MATEMATICA_BASICA_1
	/meet_AREA_MATEMATICA_BASICA_2
	/meet_AREA_MATEMATICA_INTERMEDIA_1
	/meet_AREA_MATEMATICA_INTERMEDIA_2
	/meet_AREA_MATEMATICA_INTERMEDIA_3
	/meet_AREA_SOCIAL_HUMANISTICA_1
	/meet_AREA_SOCIAL_HUMANISTICA_2
	/meet_AREA_TECNICA_COMPLEMENTARIA_1
	/meet_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_1
	/meet_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_2
	/meet_AUTOMATIZACION_INDUSTRIAL
	/meet_BALANCE_DE_MASA_Y_ENERGIA
	/meet_BIOINGENIERIA_1
	/meet_BIOLOGIA
	/meet_CALIDAD_DEL_AGUA
	/meet_CALIDAD_DEL_AIRE
	/meet_CIENCIA_DE_LOS_MATERIALES
	/meet_CIMENTACIONES_1
	/meet_CIMENTACIONES_2
	/meet_CINETICA_DE_PROCESOS_QUIMICOS
	/meet_CIRCUITOS_ELECTRICOS_1
	/meet_CIRCUITOS_ELECTRICOS_2
	/meet_COMUNICACIONES_1
	/meet_COMUNICACIONES_2
	/meet_COMUNICACIONES_3
	/meet_COMUNICACIONES_4
	
	
	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 2) {
				bot.sendMessage(
					user_id,
					`
	/meet_CONCRETO_ARMADO_1
	/meet_CONCRETO_ARMADO_2
	/meet_CONCRETO_PREESFORZADO
	/meet_CONTABILIDAD_1
	/meet_CONTABILIDAD_2
	/meet_CONTABILIDAD_3
	/meet_CONTROL_DE_CONTAMINANTES_INDUSTRIALES
	/meet_CONTROL_DE_LA_PRODUCCION
	/meet_CONTROLES_INDUSTRIALES
	/meet_CONVERSION_DE_ENERGIA_ELECTROMECANICA_1
	/meet_CONVERSION_DE_ENERGIA_ELECTROMECANICA_2
	/meet_COSTOS_PRESUPUESTOS_Y_AVALUOS
	/meet_CURSO_PREPARATORIO_IDIOMA_TECNICO
	/meet_DEPORTES_1
	/meet_DIBUJO_CONSTRUCTIVO_PARA_INGENIERIA
	/meet_DIBUJO_TECNICO_MECANICO
	/meet_DIPLO_ADMINISTRACION_Y_COMPETENCIAS
	/meet_DIPLO_APLICACION_DE_LA_NORMA_ISO_21500
	/meet_DIPLO_BUENAS_PRACTICAS_DE_MAN_EN_LA_IND_FARMA_Y_ALIMENTICIA
	/meet_DIPLO_EMPRESA_Y_SOCIEDADES_MERCANTILES
	/meet_DIPLO_EN_ACONDICIONAMIENTO_DEL_AGUA_EN_LA_INDUSTRIA
	/meet_DIPLO_EN_ADMINISTRACION_DE_CALIDAD_INDUSTRIA_ALIMENTICIA 
	/meet_DIPLO_EN_GESTION_GERENCIAL_DE_OPERACIONES
	/meet_DIPLO_EN_LIDERAZGO_DEL_TALENTO_HUMANO
	/meet_DIPLO_EN_RECURSOS_HUMANOS
	/meet_DIPLO_EN_VALUACION_INMOBILIARIA
	/meet_DIPLO_FORMULACION_Y_EVALUACION_DE_PROYECTOS
	/meet_DIPLO_MANTENIMIENTO_INDUSTRIAL
	/meet_DIPLO_SEGURIDAD_INDUSTRIAL_Y_SALUD_OCUPACIONAL
	/meet_DISENO_DE_EQUIPO
	/meet_DISENO_DE_ESTRUCTURAS_EN_MAMPOSTERIA
	/meet_DISENO_DE_ESTRUCTURAS_METALICAS_1
	/meet_DISENO_DE_MAQUINAS_1
	/meet_DISENO_DE_MAQUINAS_2
	/meet_DISENO_DE_MAQUINAS_3
	/meet_DISENO_DE_PLANTAS
	/meet_DISENO_ESTRUCTURAL
	/meet_DISENO_ESTRUCTURAL_1
	/meet_DISENO_PARA_LA_PRODUCCION
	/meet_ECOLOGIA
	/meet_ECONOMIA
	/meet_ECONOMIA_INDUSTRIAL
	/meet_ECONOMIA_INDUSTRIAL_DIPLO
	/meet_ELECTRICIDAD_Y_ELECTRONICA_BASICA
	/meet_ELECTRONICA_1
	

	<- /menos_meets

	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 3) {
				bot.sendMessage(
					user_id,
					`
	/meet_ELECTRONICA_2
	/meet_ELECTRONICA_3
	/meet_ELECTRONICA_4
	/meet_ELECTRONICA_5
	/meet_ELECTRONICA_6
	/meet_ELECTRONICA_APLICADA_2
	/meet_EMPRENDEDORES_DE_NEGOCIOS_INFORMATICOS
	/meet_ESTADISTICA_1
	/meet_ESTADISTICA_2
	/meet_ESTRUCTURAS_DE_DATOS
	/meet_ETICA_PROFESIONAL
	/meet_EXTRACCIONES_INDUSTRIALES
	/meet_FILOSOFIA_DE_LA_CIENCIA
	/meet_FISICA_1
	/meet_FISICA_2
	/meet_FISICA_3
	/meet_FISICA_4
	/meet_FISICA_BASICA
	/meet_FISICO_QUIMICA_1
	/meet_FISICO_QUIMICA_2
	/meet_FLUJO_DE_FLUIDOS
	/meet_GEOGRAFIA
	/meet_GEOLOGIA
	/meet_GEOLOGIA_DEL_PETROLEO
	/meet_GEOLOGIA_ESTRUCTURAL
	/meet_GESTION_DE_DESASTRES
	/meet_GESTION_TOTAL_DE_LA_CALIDAD
	/meet_HIDRAULICA
	/meet_HIDRAULICA_DE_CANALES
	/meet_HIDROLOGIA
	/meet_IDIOMA_TECNICO_1
	/meet_IDIOMA_TECNICO_2
	/meet_IDIOMA_TECNICO_3
	/meet_IDIOMA_TECNICO_4
	/meet_INGENIERIA_DE_LA_PRODUCCION
	/meet_INGENIERIA_DE_METODOS
	/meet_INGENIERIA_DE_PLANTAS
	/meet_INGENIERIA_DE_TRANSITO_Y_TRANSPORTES
	/meet_INGENIERIA_DEL_AZUCAR
	/meet_INGENIERIA_ECONOMICA_1
	/meet_INGENIERIA_ECONOMICA_2
	/meet_INGENIERIA_ECONOMICA_3
	/meet_INGENIERIA_ELECTRICA_1
	/meet_INGENIERIA_ELECTRICA_2
	/meet_INGENIERIA_SANITARIA_1

		
	<- /menos_meets

	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 4) {
				bot.sendMessage(
					user_id,
					`	
	/meet_INGENIERIA_SANITARIA_2
	/meet_INGENIERIA_TEXTIL_1
	/meet_INSTALACION_DE_EQUIPOS_ELECTRONICOS
	/meet_INSTALACIONES_ELECTRICAS
	/meet_INSTALACIONES_ELECTRICAS_CIVIL
	/meet_INSTALACIONES_MECANICAS
	/meet_INSTRUMENTACION_ELECTRICA
	/meet_INSTRUMENTACION_MECANICA
	/meet_INTELIGENCIA_ARTIFICIAL_1
	/meet_INTRO_A_LA_GESTION_TECNOLOGICA
	/meet_INTROD_AL_ESTUDIO_DE_IMPACTO_AMBIENTAL
	/meet_INTROD_DE_PROYECTOS_GERENCIALES
	/meet_INTRODUCCION_A_LA_PROGRAMACION_DE_COMPUTADORAS
	/meet_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_1
	/meet_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_2
	/meet_INVESTIGACION_1
	/meet_INVESTIGACION_DE_OPERACIONES_I
	/meet_INVESTIGACION_DE_OPERACIONES_II
	/meet_IQ_3_TRANSFERENCIA_DE_CALOR
	/meet_IQ_4_TRANSFERENCIA_DE_MASA
	/meet_IQ_5_TRANSFERENCIA_DE_MASA_EN_UNIDADES_CONTINUAS
	/meet_LABORATORIO_DE_INGENIERIA_QUIMICA_1
	/meet_LABORATORIO_DE_INGENIERIA_QUIMICA_2
	/meet_LEGISLACION_1
	/meet_LEGISLACION_1_DIPLO
	/meet_LEGISLACION_2
	/meet_LEGISLACION_2_DIPLO
	/meet_LEGISLACION_AMBIENTAL_1
	/meet_LENGUAJES_DE_PROGRAMACION_APLICADOS_AIE
	/meet_LENGUAJES_FORMALES_Y_DE_PROGRAMACION
	/meet_LINEAS_DE_TRANSMISION
	/meet_LOGICA_DE_SISTEMAS
	/meet_MANEJO_E_IMPLEMENTACION_DE_ARCHIVOS
	/meet_MANTENIMIENTO_DE_HOSPITALES_1
	/meet_MANTENIMIENTO_DE_HOSPITALES_2
	/meet_MAQUINAS_ELECTRICAS
	/meet_MAQUINAS_HIDRAULICAS
	/meet_MATEMATICA_APLICADA_1
	/meet_MATEMATICA_APLICADA_1_DIPLO
	/meet_MATEMATICA_APLICADA_2
	/meet_MATEMATICA_APLICADA_2_DIPLO
	/meet_MATEMATICA_APLICADA_3
	/meet_MATEMATICA_APLICADA_3_DIPLO
	/meet_MATEMATICA_APLICADA_4
	/meet_MATEMATICA_APLICADA_5
	
	
	<- /menos_meets

	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 5) {
				bot.sendMessage(
					user_id,
					`		
	/meet_MATEMATICA_APLICADA_5_DIPLO
	/meet_MATEMATICA_PARA_COMPUTACION_1
	/meet_MATEMATICA_PARA_COMPUTACION_2
	/meet_MATERIALES_DE_CONSTRUCCION
	/meet_MATERIALES_DE_CONSTRUCCION_1
	/meet_MATERIALES_DE_CONSTRUCCION_2
	/meet_MECANICA_ANALITICA_1
	/meet_MECANICA_ANALITICA_2
	/meet_MECANICA_DE_FLUIDOS
	/meet_MECANICA_DE_SUELOS_1
	/meet_MECANISMOS
	/meet_MERCADOTECNIA_1
	/meet_METALURGIA_Y_METALOGRAFIA
	/meet_METODOS_DE_CONSTRUCCION
	/meet_MICROBIOLOGIA
	/meet_MICROECONOMIA
	/meet_MODELACION_Y_SIMULACION_1
	/meet_MODELACION_Y_SIMULACION_2
	/meet_MONTAJE_Y_MANTENIMIENTO_DE_EQUIPO
	/meet_MOTORES_DE_COMBUSTION_INTERNA
	/meet_OPERACIONES_Y_PROCESOS_EN_LA_INDUSTRIA_FARMACEUTICA
	/meet_ORGANIZACION_COMPUTACIONAL
	/meet_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_1
	/meet_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_2
	/meet_PAP_DE_MATEMATICA_PARA_INGENIERIA
	/meet_PAVIMENTOS
	/meet_PLANEAMIENTO
	/meet_PLANEAMIENTO_DIPLO
	/meet_PLANTAS_DE_VAPOR
	/meet_PRACTICAS_FINALES_INGENIERIA_AMBIENTAL
	/meet_PRACTICAS_FINALES_INGENIERIA_CIENCIAS_Y_SISTEMAS
	/meet_PRACTICAS_FINALES_INGENIERIA_CIVIL
	/meet_PRACTICAS_FINALES_INGENIERIA_ELECTRICA
	/meet_PRACTICAS_FINALES_INGENIERIA_ELECTRONICA
	/meet_PRACTICAS_FINALES_INGENIERIA_INDUSTRIAL
	/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA
	/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA_ELECTRICA
	/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA_INDUSTRIAL
	/meet_PRACTICAS_FINALES_INGENIERIA_QUIMICA
	/meet_PRACTICAS_INICIALES
	/meet_PRACTICAS_INTERMEDIAS
	/meet_PREPARACION_Y_EVALUACION_DE_PROYECTOS_1
	/meet_PREPARACION_Y_EVALUACION_DE_PROYECTOS_2
	/meet_PRINCIPIOS_DE_METROLOGIA
	/meet_PROCESOS_DE_MANUFACTURA_1
	
	
	<- /menos_meets

	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 6) {
				bot.sendMessage(
					user_id,
					`		
	/meet_PROCESOS_DE_MANUFACTURA_2
	/meet_PROCESOS_QUIMICOS_INDUSTRIALES
	/meet_PROGRAMACION_COMERCIAL_1
	/meet_PROGRAMACION_DE_COMPUTADORAS_1
	/meet_PROGRAMACION_DE_COMPUTADORAS_2
	/meet_PROTECCION_DE_SISTEMAS_DE_POTENCIA
	/meet_PROYECTOS_DE_COMPUTACION_APLICADA_AIE
	/meet_PSICOLOGIA_INDUSTRIAL
	/meet_PSICOLOGIA_INDUSTRIAL_DIPLO
	/meet_PUENTES
	/meet_QUIMICA_2
	/meet_QUIMICA_3
	/meet_QUIMICA_AMBIENTAL
	/meet_QUIMICA_GENERAL_1
	/meet_QUIMICA_ORGANICA_2
	/meet_QUIMICA_PARA_INGENIERIA_CIVIL
	/meet_RADIOCOMUNICACIONES_TERRESTRES
	/meet_REDES_DE_COMPUTADORAS_1
	/meet_REDES_DE_COMPUTADORAS_2
	/meet_REFRIGERACION_Y_AIRE_ACONDICIONADO
	/meet_RESISTENCIA_DE_MATERIALES_1
	/meet_RESISTENCIA_DE_MATERIALES_2
	/meet_ROBOTICA
	/meet_SANEAMIENTO_AMBIENTAL
	/meet_SEGURIDAD_E_HIGIENE_INDUSTRIAL
	/meet_SEMINARIO_DE_INVESTIGACION
	/meet_SEMINARIO_DE_INVESTIGACION_AMBIENTAL
	/meet_SEMINARIO_DE_INVESTIGACION_CIVIL
	/meet_SEMINARIO_DE_INVESTIGACION_ELECTRICA
	/meet_SEMINARIO_DE_INVESTIGACION_ELECTRONICA
	/meet_SEMINARIO_DE_INVESTIGACION_EPS
	/meet_SEMINARIO_DE_INVESTIGACION_INDUSTRIAL
	/meet_SEMINARIO_DE_INVESTIGACION_MECANICA
	/meet_SEMINARIO_DE_INVESTIGACION_MECANICA_ELECTRICA
	/meet_SEMINARIO_DE_INVESTIGACION_MECANICA_INDUSTRIAL
	/meet_SEMINARIO_DE_INVESTIGACION_QUIMICA
	/meet_SEMINARIO_DE_SISTEMAS_2
	/meet_SEMINARIO_DE_SISTEMAS_I
	/meet_SEPARACION_POR_MEDIO_DE_MEMBRANAS_SELECTIVAS
	/meet_SISTEMAS_DE_BASES_DE_DATOS_1
	/meet_SISTEMAS_DE_BASES_DE_DATOS_2
	/meet_SISTEMAS_DE_CONTROL_1
	/meet_SISTEMAS_DE_GENERACION
	/meet_SISTEMAS_OPERATIVOS_1
	/meet_SISTEMAS_OPERATIVOS_2
	
		
	<- /menos_meets

	/mas_meets ->
	`
				);
			} else if (user_actual.l_meets == 7) {
				bot.sendMessage(
					user_id,
					`		
	/meet_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_1
	/meet_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_2
	/meet_SOFTWARE_AVANZADO
	/meet_SUBESTACIONES
	/meet_TALLER_DE_SIST_DE_INF_GEOGRAFICA
	/meet_TECNICAS_DE_ESTUDIO_E_INVESTIGACION
	/meet_TECNOLOGIA_DE_LOS_ALIMENTOS
	/meet_TELECOMUNICACIONES_Y_REDES_LOCALES
	/meet_TEORIA_DE_SISTEMAS_1
	/meet_TEORIA_DE_SISTEMAS_2
	/meet_TEORIA_ELECTROMAGNETICA_1
	/meet_TEORIA_ELECTROMAGNETICA_2
	/meet_TERMODINAMICA_1
	/meet_TERMODINAMICA_2
	/meet_TERMODINAMICA_3
	/meet_TERMODINAMICA_4
	/meet_TIPOLOGIA_ESTRUCTURAL
	/meet_TOPOGRAFIA_1
	/meet_TOPOGRAFIA_2
	/meet_TOPOGRAFIA_3
	/meet_TRANSMISION_Y_DISTRIBUCION
	/meet_VIAS_TERRESTRES_1
	/meet_VIAS_TERRESTRES_2
	/meet_VIBRACIONES
	
		
	<- /menos_meets
	`
				);
			} else {
				bot.sendMessage(user_id, 'Escribe /meet');
				operaciones_usuario(null, null, null, 0);
			}
			break;
		//Cursos Add -------------------------------------------
		case '/add_ETICA_PROFESIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0001', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TECNICAS_DE_ESTUDIO_E_INVESTIGACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0005', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IDIOMA_TECNICO_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0006', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IDIOMA_TECNICO_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0008', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IDIOMA_TECNICO_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0009', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IDIOMA_TECNICO_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0011', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ECONOMIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0014', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_SOCIAL_HUMANISTICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0017', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FILOSOFIA_DE_LA_CIENCIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0018', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_SOCIAL_HUMANISTICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0019', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PSICOLOGIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0022', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_BIOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0027', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ECOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0028', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GEOGRAFIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0030', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DEPORTES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0039', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TALLER_DE_SIST_DE_INF_GEOGRAFICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0060', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_TECNICA_COMPLEMENTARIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0069', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIBUJO_TECNICO_MECANICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0073', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIBUJO_CONSTRUCTIVO_PARA_INGENIERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0074', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TOPOGRAFIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0080', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TOPOGRAFIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0082', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TOPOGRAFIA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0084', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROGRAMACION_DE_COMPUTADORAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0090', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROGRAMACION_DE_COMPUTADORAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0092', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_MATEMATICA_BASICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0101', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_MATEMATICA_BASICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0103', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_MATEMATICA_INTERMEDIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0107', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_MATEMATICA_INTERMEDIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0112', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AREA_MATEMATICA_INTERMEDIA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0114', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0116', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0118', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0120', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0122', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_5':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0123', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICA_BASICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0147', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0150', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0152', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0154', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0156', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MECANICA_ANALITICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0170', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MECANICA_ANALITICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0172', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_MECANICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0173', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CALIDAD_DEL_AIRE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0196', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CALIDAD_DEL_AGUA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0198', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_ELECTRICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0200', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTALACIONES_ELECTRICAS_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0201', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_ELECTRICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0202', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CIRCUITOS_ELECTRICOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0204', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CIRCUITOS_ELECTRICOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0206', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTALACIONES_ELECTRICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0208', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTALACION_DE_EQUIPOS_ELECTRONICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0209', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TEORIA_ELECTROMAGNETICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0210', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TEORIA_ELECTROMAGNETICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0211', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONVERSION_DE_ENERGIA_ELECTROMECANICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0212', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONVERSION_DE_ENERGIA_ELECTROMECANICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0213', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MAQUINAS_ELECTRICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0214', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SUBESTACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0216', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LINEAS_DE_TRANSMISION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0218', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TRANSMISION_Y_DISTRIBUCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0219', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_DE_SISTEMAS_DE_POTENCIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0220', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_DE_GENERACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0221', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROTECCION_DE_SISTEMAS_DE_POTENCIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0222', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ALTA_TENSION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0224', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTRUMENTACION_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0230', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0232', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0234', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ROBOTICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0235', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_DE_CONTROL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0236', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AUTOMATIZACION_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0238', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_APLICADA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0239', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0240', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_RADIOCOMUNICACIONES_TERRESTRES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0241', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_COMUNICACIONES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0242', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_COMUNICACIONES_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0243', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_COMUNICACIONES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0244', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_COMUNICACIONES_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0245', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0246', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_5':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0248', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRONICA_6':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0249', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MECANICA_DE_FLUIDOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0250', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_HIDRAULICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0252', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_HIDROLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0254', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MAQUINAS_HIDRAULICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0258', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_AGUAS_SUBTERRANEAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0262', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_SANITARIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0280', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_OPERATIVOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0281', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_SANITARIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0282', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_Y_DISENO_DE_SISTEMAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0283', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SANEAMIENTO_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0284', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_OPERATIVOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0285', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_HIDRAULICA_DE_CANALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0286', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTROD_AL_ESTUDIO_DE_IMPACTO_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0288', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_RESISTENCIA_DE_MATERIALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0300', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_RESISTENCIA_DE_MATERIALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0302', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_ESTRUCTURAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0306', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TIPOLOGIA_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0307', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0311', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONCRETO_ARMADO_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0314', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONCRETO_PREESFORZADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0315', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONCRETO_ARMADO_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0316', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CIMENTACIONES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0318', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CIMENTACIONES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0320', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0321', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_ESTRUCTURAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0322', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_ESTRUCTURAS_EN_MAMPOSTERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0323', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_ESTRUCTURAS_METALICAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0325', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PUENTES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0332', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GESTION_DE_DESASTRES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0335', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_METODOS_DE_CONSTRUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0340', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_GENERAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0348', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_PARA_INGENIERIA_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0349', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0352', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0354', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_ORGANICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0360', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_CUALITATIVO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0362', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_INSTRUMENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0366', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRINCIPIOS_DE_METROLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0368', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_QUIMICA_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0370', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICO_QUIMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0380', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FISICO_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0382', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TERMODINAMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0390', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TERMODINAMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0392', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TERMODINAMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0394', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TERMODINAMICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0396', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CINETICA_DE_PROCESOS_QUIMICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0398', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEPARACION_POR_MEDIO_DE_MEMBRANAS_SELECTIVAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0409', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_BALANCE_DE_MASA_Y_ENERGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0410', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_FLUJO_DE_FLUIDOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0412', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IQ_3_TRANSFERENCIA_DE_CALOR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0414', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IQ_4_TRANSFERENCIA_DE_MASA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0416', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_IQ_5_TRANSFERENCIA_DE_MASA_EN_UNIDADES_CONTINUAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0418', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GESTION_TOTAL_DE_LA_CALIDAD':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0421', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_EXTRACCIONES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0423', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTRO_A_LA_GESTION_TECNOLOGICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0425', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LABORATORIO_DE_INGENIERIA_QUIMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0428', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LABORATORIO_DE_INGENIERIA_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0430', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_DEL_AZUCAR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0433', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROCESOS_QUIMICOS_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0434', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_EQUIPO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0436', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTROL_DE_CONTAMINANTES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0437', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MICROBIOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0440', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_BIOINGENIERIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0442', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GEOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0450', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CIENCIA_DE_LOS_MATERIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0452', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATERIALES_DE_CONSTRUCCION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0453', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_METALURGIA_Y_METALOGRAFIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0454', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATERIALES_DE_CONSTRUCCION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0455', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATERIALES_DE_CONSTRUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0456', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MECANICA_DE_SUELOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0458', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PAVIMENTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0460', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ELECTRICIDAD_Y_ELECTRONICA_BASICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0462', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TECNOLOGIA_DE_LOS_ALIMENTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0472', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GEOLOGIA_DEL_PETROLEO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0476', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_OPERACIONES_Y_PROCESOS_EN_LA_INDUSTRIA_FARMACEUTICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0482', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_PLANTAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0486', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_REFRIGERACION_Y_AIRE_ACONDICIONADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0502', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MOTORES_DE_COMBUSTION_INTERNA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0504', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PLANTAS_DE_VAPOR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0506', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MONTAJE_Y_MANTENIMIENTO_DE_EQUIPO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0508', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTALACIONES_MECANICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0510', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MANTENIMIENTO_DE_HOSPITALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0511', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INSTRUMENTACION_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0512', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MANTENIMIENTO_DE_HOSPITALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0513', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROCESOS_DE_MANUFACTURA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0520', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROCESOS_DE_MANUFACTURA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0522', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_MAQUINAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0524', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_MAQUINAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0526', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_DE_MAQUINAS_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0528', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MECANISMOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0530', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_VIBRACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0532', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_VIAS_TERRESTRES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0550', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_VIAS_TERRESTRES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0560', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_DE_TRANSITO_Y_TRANSPORTES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0585', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INVESTIGACION_DE_OPERACIONES_I':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0601', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INVESTIGACION_DE_OPERACIONES_II':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0603', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_DE_SISTEMAS_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0606', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTROD_DE_PROYECTOS_GERENCIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0608', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_DE_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0630', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_DE_PLANTAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0632', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_DE_METODOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0634', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DISENO_PARA_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0636', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTROLES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0638', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTROL_DE_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0640', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEGURIDAD_E_HIGIENE_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0642', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_TEXTIL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0644', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTABILIDAD_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0650', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTABILIDAD_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0652', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CONTABILIDAD_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0654', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_EMPRESAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0656', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_EMPRESAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0657', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_PERSONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0658', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MERCADOTECNIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0660', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LEGISLACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0662', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LEGISLACION_AMBIENTAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0663', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LEGISLACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0664', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MICROECONOMIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0665', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_COSTOS_PRESUPUESTOS_Y_AVALUOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0666', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROGRAMACION_COMERCIAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0667', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ECONOMIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0669', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_GEOLOGIA_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0687', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_ECONOMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0700', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_ECONOMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0702', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INGENIERIA_ECONOMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0704', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PREPARACION_Y_EVALUACION_DE_PROYECTOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0706', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PREPARACION_Y_EVALUACION_DE_PROYECTOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0708', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PLANEAMIENTO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0710', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MODELACION_Y_SIMULACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0720', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TEORIA_DE_SISTEMAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0722', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TEORIA_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0724', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MODELACION_Y_SIMULACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0729', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ESTADISTICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0732', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ESTADISTICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0734', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_PROBABILISTICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0736', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTRODUCCION_A_LA_PROGRAMACION_DE_COMPUTADORAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0769', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0770', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0771', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ESTRUCTURAS_DE_DATOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0772', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MANEJO_E_IMPLEMENTACION_DE_ARCHIVOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0773', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_DE_BASES_DE_DATOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0774', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_DE_BASES_DE_DATOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0775', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0777', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0778', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0779', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SOFTWARE_AVANZADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0780', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0781', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_Y_DISENO_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0785', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0786', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0787', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_EMPRENDEDORES_DE_NEGOCIOS_INFORMATICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0790', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LOGICA_DE_SISTEMAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0795', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LENGUAJES_FORMALES_Y_DE_PROGRAMACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0796', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_SISTEMAS_I':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0797', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0798', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0799', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_PARA_COMPUTACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0960', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_PARA_COMPUTACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0962', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ORGANIZACION_COMPUTACIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0964', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_TELECOMUNICACIONES_Y_REDES_LOCALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0969', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_REDES_DE_COMPUTADORAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0970', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INTELIGENCIA_ARTIFICIAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0972', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_REDES_DE_COMPUTADORAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0975', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PROYECTOS_DE_COMPUTACION_APLICADA_AIE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0980', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LENGUAJES_DE_PROGRAMACION_APLICADOS_AIE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0991', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_ACONDICIONAMIENTO_DEL_AGUA_EN_LA_INDUSTRIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1023', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_ADMINISTRACION_DE_CALIDAD_INDUSTRIA_ALIMENTICIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1034', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_FORMULACION_Y_EVALUACION_DE_PROYECTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1054', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_SEGURIDAD_INDUSTRIAL_Y_SALUD_OCUPACIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1056', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_BUENAS_PRACTICAS_DE_MAN_EN_LA_IND_FARMA_Y_ALIMENTICIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1059', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_ADMINISTRACION_Y_COMPETENCIAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1065', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_MANTENIMIENTO_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1071', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_LIDERAZGO_DEL_TALENTO_HUMANO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1074', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_VALUACION_INMOBILIARIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1075', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_GESTION_GERENCIAL_DE_OPERACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1076', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EN_RECURSOS_HUMANOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1077', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_EMPRESA_Y_SOCIEDADES_MERCANTILES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1078', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_DIPLO_APLICACION_DE_LA_NORMA_ISO_21500':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1080', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2001', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_QUIMICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2002', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2003', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2004', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2005', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_MECANICA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2006', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_MECANICA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2007', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_CIENCIAS_Y_SISTEMAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2009', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_ELECTRONICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2013', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_INICIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2025', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_FINALES_INGENIERIA_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2035', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PRACTICAS_INTERMEDIAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2036', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PSICOLOGIA_INDUSTRIAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3022', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_3_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3116', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3118', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3120', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_MATEMATICA_APLICADA_5_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3123', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ANALISIS_DE_SISTEMAS_INDUSTRIALES_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3606', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_EMPRESAS_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3656', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_EMPRESAS_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3657', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ADMINISTRACION_DE_PERSONAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3658', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LEGISLACION_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3662', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_LEGISLACION_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3664', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_ECONOMIA_INDUSTRIAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3669', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PLANEAMIENTO_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3710', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_QUIMICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7902', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7904', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7905', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_ELECTRONICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7913', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7935', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_INVESTIGACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7980', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_EPS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7990', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7991', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7993', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_MECANICA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7994', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_SEMINARIO_DE_INVESTIGACION_MECANICA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7995', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_PAP_DE_MATEMATICA_PARA_INGENIERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('9000', null, null, null);
			buscar_seccion_add();
			break;

		case '/add_CURSO_PREPARATORIO_IDIOMA_TECNICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('9998', null, null, null);
			buscar_seccion_add();
			break;

		//Cursos Meet -------------------------------------------
		case '/meet_ETICA_PROFESIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0001', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TECNICAS_DE_ESTUDIO_E_INVESTIGACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0005', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IDIOMA_TECNICO_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0006', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IDIOMA_TECNICO_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0008', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IDIOMA_TECNICO_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0009', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IDIOMA_TECNICO_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0011', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ECONOMIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0014', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_SOCIAL_HUMANISTICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0017', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FILOSOFIA_DE_LA_CIENCIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0018', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_SOCIAL_HUMANISTICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0019', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PSICOLOGIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0022', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_BIOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0027', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ECOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0028', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GEOGRAFIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0030', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DEPORTES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0039', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TALLER_DE_SIST_DE_INF_GEOGRAFICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0060', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_TECNICA_COMPLEMENTARIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0069', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIBUJO_TECNICO_MECANICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0073', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIBUJO_CONSTRUCTIVO_PARA_INGENIERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0074', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TOPOGRAFIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0080', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TOPOGRAFIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0082', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TOPOGRAFIA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0084', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROGRAMACION_DE_COMPUTADORAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0090', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROGRAMACION_DE_COMPUTADORAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0092', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_MATEMATICA_BASICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0101', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_MATEMATICA_BASICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0103', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_MATEMATICA_INTERMEDIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0107', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_MATEMATICA_INTERMEDIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0112', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AREA_MATEMATICA_INTERMEDIA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0114', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0116', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0118', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0120', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0122', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_5':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0123', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICA_BASICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0147', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0150', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0152', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0154', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0156', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MECANICA_ANALITICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0170', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MECANICA_ANALITICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0172', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_MECANICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0173', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CALIDAD_DEL_AIRE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0196', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CALIDAD_DEL_AGUA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0198', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_ELECTRICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0200', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTALACIONES_ELECTRICAS_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0201', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_ELECTRICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0202', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CIRCUITOS_ELECTRICOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0204', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CIRCUITOS_ELECTRICOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0206', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTALACIONES_ELECTRICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0208', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTALACION_DE_EQUIPOS_ELECTRONICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0209', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TEORIA_ELECTROMAGNETICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0210', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TEORIA_ELECTROMAGNETICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0211', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONVERSION_DE_ENERGIA_ELECTROMECANICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0212', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONVERSION_DE_ENERGIA_ELECTROMECANICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0213', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MAQUINAS_ELECTRICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0214', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SUBESTACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0216', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LINEAS_DE_TRANSMISION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0218', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TRANSMISION_Y_DISTRIBUCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0219', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_DE_SISTEMAS_DE_POTENCIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0220', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_DE_GENERACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0221', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROTECCION_DE_SISTEMAS_DE_POTENCIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0222', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ALTA_TENSION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0224', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTRUMENTACION_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0230', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0232', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0234', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ROBOTICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0235', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_DE_CONTROL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0236', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AUTOMATIZACION_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0238', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_APLICADA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0239', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0240', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_RADIOCOMUNICACIONES_TERRESTRES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0241', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_COMUNICACIONES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0242', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_COMUNICACIONES_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0243', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_COMUNICACIONES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0244', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_COMUNICACIONES_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0245', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0246', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_5':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0248', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRONICA_6':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0249', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MECANICA_DE_FLUIDOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0250', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_HIDRAULICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0252', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_HIDROLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0254', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MAQUINAS_HIDRAULICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0258', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_AGUAS_SUBTERRANEAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0262', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_SANITARIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0280', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_OPERATIVOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0281', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_SANITARIA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0282', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_Y_DISENO_DE_SISTEMAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0283', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SANEAMIENTO_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0284', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_OPERATIVOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0285', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_HIDRAULICA_DE_CANALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0286', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTROD_AL_ESTUDIO_DE_IMPACTO_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0288', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_RESISTENCIA_DE_MATERIALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0300', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_RESISTENCIA_DE_MATERIALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0302', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_ESTRUCTURAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0306', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TIPOLOGIA_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0307', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0311', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONCRETO_ARMADO_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0314', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONCRETO_PREESFORZADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0315', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONCRETO_ARMADO_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0316', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CIMENTACIONES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0318', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CIMENTACIONES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0320', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0321', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_ESTRUCTURAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0322', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_ESTRUCTURAS_EN_MAMPOSTERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0323', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_ESTRUCTURAS_METALICAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0325', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PUENTES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0332', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GESTION_DE_DESASTRES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0335', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_METODOS_DE_CONSTRUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0340', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_GENERAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0348', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_PARA_INGENIERIA_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0349', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0352', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0354', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_ORGANICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0360', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_CUALITATIVO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0362', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_INSTRUMENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0366', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRINCIPIOS_DE_METROLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0368', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_QUIMICA_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0370', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICO_QUIMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0380', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FISICO_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0382', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TERMODINAMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0390', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TERMODINAMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0392', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TERMODINAMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0394', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TERMODINAMICA_4':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0396', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CINETICA_DE_PROCESOS_QUIMICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0398', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEPARACION_POR_MEDIO_DE_MEMBRANAS_SELECTIVAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0409', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_BALANCE_DE_MASA_Y_ENERGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0410', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_FLUJO_DE_FLUIDOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0412', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IQ_3_TRANSFERENCIA_DE_CALOR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0414', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IQ_4_TRANSFERENCIA_DE_MASA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0416', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_IQ_5_TRANSFERENCIA_DE_MASA_EN_UNIDADES_CONTINUAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0418', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GESTION_TOTAL_DE_LA_CALIDAD':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0421', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_EXTRACCIONES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0423', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTRO_A_LA_GESTION_TECNOLOGICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0425', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LABORATORIO_DE_INGENIERIA_QUIMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0428', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LABORATORIO_DE_INGENIERIA_QUIMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0430', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_DEL_AZUCAR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0433', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROCESOS_QUIMICOS_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0434', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_EQUIPO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0436', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTROL_DE_CONTAMINANTES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0437', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MICROBIOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0440', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_BIOINGENIERIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0442', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GEOLOGIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0450', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CIENCIA_DE_LOS_MATERIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0452', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATERIALES_DE_CONSTRUCCION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0453', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_METALURGIA_Y_METALOGRAFIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0454', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATERIALES_DE_CONSTRUCCION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0455', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATERIALES_DE_CONSTRUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0456', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MECANICA_DE_SUELOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0458', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PAVIMENTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0460', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ELECTRICIDAD_Y_ELECTRONICA_BASICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0462', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TECNOLOGIA_DE_LOS_ALIMENTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0472', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GEOLOGIA_DEL_PETROLEO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0476', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_OPERACIONES_Y_PROCESOS_EN_LA_INDUSTRIA_FARMACEUTICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0482', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_PLANTAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0486', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_REFRIGERACION_Y_AIRE_ACONDICIONADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0502', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MOTORES_DE_COMBUSTION_INTERNA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0504', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PLANTAS_DE_VAPOR':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0506', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MONTAJE_Y_MANTENIMIENTO_DE_EQUIPO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0508', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTALACIONES_MECANICAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0510', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MANTENIMIENTO_DE_HOSPITALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0511', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INSTRUMENTACION_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0512', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MANTENIMIENTO_DE_HOSPITALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0513', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROCESOS_DE_MANUFACTURA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0520', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROCESOS_DE_MANUFACTURA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0522', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_MAQUINAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0524', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_MAQUINAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0526', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_DE_MAQUINAS_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0528', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MECANISMOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0530', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_VIBRACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0532', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_VIAS_TERRESTRES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0550', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_VIAS_TERRESTRES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0560', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_DE_TRANSITO_Y_TRANSPORTES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0585', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INVESTIGACION_DE_OPERACIONES_I':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0601', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INVESTIGACION_DE_OPERACIONES_II':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0603', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_DE_SISTEMAS_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0606', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTROD_DE_PROYECTOS_GERENCIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0608', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_DE_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0630', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_DE_PLANTAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0632', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_DE_METODOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0634', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DISENO_PARA_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0636', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTROLES_INDUSTRIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0638', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTROL_DE_LA_PRODUCCION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0640', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEGURIDAD_E_HIGIENE_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0642', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_TEXTIL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0644', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTABILIDAD_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0650', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTABILIDAD_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0652', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CONTABILIDAD_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0654', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_EMPRESAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0656', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_EMPRESAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0657', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_PERSONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0658', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MERCADOTECNIA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0660', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LEGISLACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0662', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LEGISLACION_AMBIENTAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0663', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LEGISLACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0664', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MICROECONOMIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0665', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_COSTOS_PRESUPUESTOS_Y_AVALUOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0666', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROGRAMACION_COMERCIAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0667', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ECONOMIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0669', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_GEOLOGIA_ESTRUCTURAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0687', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_ECONOMICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0700', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_ECONOMICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0702', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INGENIERIA_ECONOMICA_3':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0704', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PREPARACION_Y_EVALUACION_DE_PROYECTOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0706', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PREPARACION_Y_EVALUACION_DE_PROYECTOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0708', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PLANEAMIENTO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0710', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MODELACION_Y_SIMULACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0720', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TEORIA_DE_SISTEMAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0722', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TEORIA_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0724', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MODELACION_Y_SIMULACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0729', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ESTADISTICA_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0732', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ESTADISTICA_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0734', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_PROBABILISTICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0736', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTRODUCCION_A_LA_PROGRAMACION_DE_COMPUTADORAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0769', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0770', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTRODUCCION_A_LA_PROGRAMACION_Y_COMPUTACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0771', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ESTRUCTURAS_DE_DATOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0772', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MANEJO_E_IMPLEMENTACION_DE_ARCHIVOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0773', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_DE_BASES_DE_DATOS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0774', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_DE_BASES_DE_DATOS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0775', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0777', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0778', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ARQUITECTURA_DE_COMPUTADORES_Y_ENSAMBLADORES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0779', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SOFTWARE_AVANZADO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0780', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ORGANIZACION_DE_LENGUAJES_Y_COMPILADORES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0781', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_Y_DISENO_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0785', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0786', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SISTEMAS_ORGANIZACIONALES_Y_GERENCIALES_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0787', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_EMPRENDEDORES_DE_NEGOCIOS_INFORMATICOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0790', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LOGICA_DE_SISTEMAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0795', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LENGUAJES_FORMALES_Y_DE_PROGRAMACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0796', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_SISTEMAS_I':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0797', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_SISTEMAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0798', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0799', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_PARA_COMPUTACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0960', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_PARA_COMPUTACION_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0962', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ORGANIZACION_COMPUTACIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0964', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_TELECOMUNICACIONES_Y_REDES_LOCALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0969', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_REDES_DE_COMPUTADORAS_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0970', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INTELIGENCIA_ARTIFICIAL_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0972', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_REDES_DE_COMPUTADORAS_2':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0975', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PROYECTOS_DE_COMPUTACION_APLICADA_AIE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0980', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LENGUAJES_DE_PROGRAMACION_APLICADOS_AIE':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('0991', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_ACONDICIONAMIENTO_DEL_AGUA_EN_LA_INDUSTRIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1023', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_ADMINISTRACION_DE_CALIDAD_INDUSTRIA_ALIMENTICIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1034', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_FORMULACION_Y_EVALUACION_DE_PROYECTOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1054', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_SEGURIDAD_INDUSTRIAL_Y_SALUD_OCUPACIONAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1056', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_BUENAS_PRACTICAS_DE_MAN_EN_LA_IND_FARMA_Y_ALIMENTICIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1059', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_ADMINISTRACION_Y_COMPETENCIAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1065', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_MANTENIMIENTO_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1071', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_LIDERAZGO_DEL_TALENTO_HUMANO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1074', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_VALUACION_INMOBILIARIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1075', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_GESTION_GERENCIAL_DE_OPERACIONES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1076', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EN_RECURSOS_HUMANOS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1077', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_EMPRESA_Y_SOCIEDADES_MERCANTILES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1078', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_DIPLO_APLICACION_DE_LA_NORMA_ISO_21500':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('1080', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2001', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_QUIMICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2002', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2003', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2004', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2005', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2006', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_MECANICA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2007', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_CIENCIAS_Y_SISTEMAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2009', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_ELECTRONICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2013', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_INICIALES':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2025', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_FINALES_INGENIERIA_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2035', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PRACTICAS_INTERMEDIAS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('2036', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PSICOLOGIA_INDUSTRIAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3022', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_3_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3116', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3118', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3120', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_MATEMATICA_APLICADA_5_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3123', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ANALISIS_DE_SISTEMAS_INDUSTRIALES_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3606', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_EMPRESAS_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3656', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_EMPRESAS_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3657', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ADMINISTRACION_DE_PERSONAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3658', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LEGISLACION_1_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3662', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_LEGISLACION_2_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3664', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_ECONOMIA_INDUSTRIAL_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3669', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PLANEAMIENTO_DIPLO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('3710', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_QUIMICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7902', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7904', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7905', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_ELECTRONICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7913', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_AMBIENTAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7935', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_INVESTIGACION_1':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7980', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_EPS':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7990', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_CIVIL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7991', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_MECANICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7993', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_MECANICA_ELECTRICA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7994', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_SEMINARIO_DE_INVESTIGACION_MECANICA_INDUSTRIAL':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('7995', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_PAP_DE_MATEMATICA_PARA_INGENIERIA':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('9000', null, null, null);
			buscar_seccion_meet();
			break;

		case '/meet_CURSO_PREPARATORIO_IDIOMA_TECNICO':
			bot.sendMessage(user_id, 'Escoge la Seccion **');
			operaciones_usuario('9998', null, null, null);
			buscar_seccion_meet();
			break;
		//Comandos de soporte
		case '/backup_rm':
			bot.sendMessage(user_id, 'https://bot-inge.herokuapp.com/backup');
			bot.sendMessage(user_id, 'https://bot-inge.herokuapp.com/backup2');
			break;

		case '/cbackup_rm':
			pre_data_cursos = fs.readFileSync('links.json');
			data_cursos = JSON.parse(pre_data_cursos);
			bot.sendMessage(user_id, 'Backup Cargado de Cursos');
			break;

		case '/cclean_rm':
			pre_data_cursos = fs.readFileSync('plantilla.json');
			data_cursos = JSON.parse(pre_data_cursos);
			bot.sendMessage(user_id, 'Plantilla Cargada');
			break;
		case '/dardebaja':
			bot.sendMessage(
				user_id,
				`Gracias, vuelva pronto
			
			(porfavor eliminar inmediatamente este chat, no responda a este mensaje)`
			);
			data_usuarios.splice(data_usuarios.indexOf(user_actual), 1);

			break;
		case '/dudas':
			bot.sendMessage(
				user_id,
				`
				1) Como agrego los links de los cursos que estoy llevando?

				Para agregar un link de meet utiliza el comando /addlink, seguido de esto selecciona el curso, luego saldra el listado de secciones (basado en el horario general) y por ultimo copia y pega el enlace de meet (unicamente el link de meet)

				2) Como veo el link de algun curso?

				Para ver los links de meet utiliza el comando /meet, seguido de esto selecciona el curso, luego saldra un listado de secciones (ojo, a diferencia de addlink apareceran Unicamente las secciones que SI posean link guardado, sino sale ninguna seccion significa que aun no hay link para esa seccion)

				3) Agrege un link en la seccion incorrecta, que hago?

				Por el momento la gestion es por medio del bot, no hay inconveniente en que te confundas, unicamente vuelve a seleccionar el curso y la seccion en donde te confundiste y esta vez agrega este meet vacio meet.google.com para que se entienda que hubo una confusion, yo borrare los vacios poco a poco en siguientes actualizaciones

				4) Estan todos los links?

				No, por obvias razones lastimosamente no poseo los links de todos los cursos y secciones existentes, asi que poco a poco entre todos debemos darnos a la tarea de recopilarlos

				5) Agregaran laboratorios?

				Posiblemente, pero depende del progreso que tengamos actualmente con cursos

				(Si tienes alguna otra duda puedes enviarla a mi correo, informacion en /help)
				`
			);
			break;
		case '/count':
			let count_users = 0,
				count_cursos = 0;

			data_usuarios.forEach((e) => {
				if (e.id != 0) {
					count_users += 1;
				}
			});

			data_cursos.forEach((e) => {
				e.mas.forEach((y) => {
					if (y.link.length != 0) {
						count_cursos += 1;
					}
				});
			});
			bot.sendMessage(
				user_id,
				`
				Actualmente ${count_users} usuarios Activos y ${count_cursos} links agregados
				`
			);
			break;
		case '/test':
			bot.sendMessage(
				user_id,
				`
				test update 10
				`
			);
			break;

		case '/about':
			bot.sendMessage(
				user_id,
				`***
				Aqui no sabia que poner... so... talvez un easterEgg! okno jajaja.
	
				-Rauqoz

				Este mensaje no esta soportado por telegram jajaja.

				-Maoz


				* Cuando ya no quieras recibir mensajes de este bot (desuscribirse) porfavor utilizar el comando /dardebaja , seguido de eso borrar el chat con el bot

				* Si se dio de baja y quiere volver a usar el bot, nuevamente utilizar el comando /start
				
				*Este bot esta creado sin fines de lucro*
				`
			);
			break;

		case '/help':
			bot.sendMessage(
				user_id,
				`
				Bienvenido, espero este bot sea de ayuda tanto para ti como para el resto de nuestros compañeros en la Facultad, Toma nota:
			
				* Este bot cuenta (por el momento) unicamente con Links de Meet de Cursos (No Laboratorios aun).
			
				* La abreviacion "DIPLO" la veras en cursos que son DIPLOMADOS.
			
				* Todos los cursos estan ordenados Alfabeticamente.
				
				* Si deseas agregar un link (unicamente de meet) de algun curso que tengas conocimiento, puedes hacerlo utilizando /addlink .
			
				* Si deseas ver el link (unicamente de meet), si estubiera agregado, puedes consultar utilizando /meet .
			
				* Si tienes alguna duda puedes enviar un correo a raul4.antonio@yahoo.com con el asunto [Bot_Ingenieria], con gusto lo revisare.
			
				`
			);
			break;

		default:
			if (msg.text.match(/meet.google.com/i) && user_actual.code.length != 0) {
				data_cursos.forEach((e) => {
					if (e.codigo == user_actual.code) {
						e.mas.forEach((y) => {
							if (y.seccion == user_actual.section) {
								if (y.link.length != 0) {
									bot.sendMessage(user_id, 'Link Actualizado Gracias!');
								} else {
									bot.sendMessage(user_id, 'Link Agregado Gracias!');
								}
								let fecha = new Date();
								y.link = msg.text;
								y.user = user_nick;
								y.date = fecha;
							}
						});
					}
				});
				limpiar();
			} else if (msg.text.match(/\/meet_seccion_/i)) {
				if (user_actual.code.length != 0) {
					data_cursos.forEach((e) => {
						if (e.codigo == user_actual.code) {
							e.mas.forEach((y) => {
								if (y.seccion == msg.text.substr(14)) {
									if (y.link.length != 0) {
										bot.sendMessage(
											user_id,
											`El Link de Meet es ${y.link} <- seccion ${y.seccion}`
										);
										bot.sendMessage(
											user_id,
											`
										Aporte de  ${y.user}
										Actualizado ${y.date}
										`
										);
									} else {
										bot.sendMessage(user_id, 'No hay Link aun :( Venga mas Tarde');
									}
								}
							});
						}
					});
					bot.sendMessage(user_id, `----------`);
				} else {
					bot.sendMessage(user_id, 'Escoge un Curso Primero :(');
				}
				limpiar();
			} else if (msg.text.match(/\/add_seccion_/i)) {
				if (user_actual.code.length != 0) {
					bot.sendMessage(user_id, 'Escribe Solamente el Link de Meet Porfavor n.n **');
					operaciones_usuario(null, msg.text.substr(13), null, null);
				} else {
					bot.sendMessage(user_id, 'Escoge un Curso Primero :( ');
					limpiar();
				}
			} else if (msg.text.match(/\/dif/i)) {
				let anuncio = `
				*** Seccion de Anuncios ***
			
				${msg.text.substring(4)}
				

				(No quieres mas mensajes de este bot? revisa /about)
				-Rauqoz`;

				data_usuarios.forEach((e) => {
					if (e.id != 0) {
						bot.sendMessage(e.id, anuncio);
					}
				});
			} else {
				bot.sendMessage(user_id, 'Tienes Problemas? utiliza /help');
				limpiar();
			}
			break;
	}
});

// Server on
App.listen(port, function() {
	console.log('Rauqoz ' + port);
});

/* Descripcion Edit Commands
start - Iniciar el Bot
addlink - Agregar el Meet para un curso 
meet - Ver el Meet de un curso (si existe)
help - Ayuda y un par de especificaciones
dudas - Preguntas Frecuentes
about - about?
*/
