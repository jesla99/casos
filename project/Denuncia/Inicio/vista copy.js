'use strict'
import {Ventana} from '../../../js/libs/core.js';
import { japArbol } from '../../../js/libs/japUtiles.js';

export class miVentana extends Ventana{
    alCargar(){
        return `<h2><br>Denuncias</h2>`;
    }

    alCargado(){
        const data=[
            {
                nombre:'Conflictividad Agraria', 
                id:1,
                hijos:[
                    {
                        nombre:'Disputas de derecho', id:2,
                        hijos:[
                            {nombre:'Doble o múltiple título de propiedad', id:2},
                            {nombre:'Doble o múltiple registro de propiedad', id:2},
                            {nombre:'Falta de inscripción registral', id:2},
                            {nombre:'Vicios registrales', id:2},
                            {nombre:'Error estatal de adjudicación de tierras', id:2},
                            {nombre:'Reivindicación histórica', id:2},
                            {nombre:'Falta de definición y establecimiento de linderos', id:2},
                            {nombre:'Servidumbres', id:2},
                            {nombre:'otros', id:2}
                        ]
                    },
                    {
                        nombre:'Límites territoriales Municipales', id:2,
                        hijos: [
                            {nombre:'Límites municipales', id:2},
                        ]
                    },
                    {
                        nombre:'Regulaciones', id:2,
                        hijos:[
                            {nombre:'Falta de legitimación para el reclamo del derecho', id:2},
                            {nombre:'Adjudicaciones presuntamente anómalas', id:2},
                            {nombre:'Tierras nacionales adscritas o inscritas con destsinos específicos no vigentes', id:2},
                            {nombre:'Otros', id:2},
                        ]
                    },
                    {
                        nombre:'Ocupaciones', id:2,
                        hijos:[
                            {nombre:'Ocupación de tierras con la calidad legal de área protegida', id:2},
                            {nombre:'Pro reclamo de pago de prestaciones laborales', id:2},
                            {nombre:'Antecedentes clonados', id:2},
                            {nombre:'Movilizaciones de movimientos campesinos', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    }
                ]
            },
            {
                nombre:'Conflictividad por explotación de recursos naturales',
                id:3,
                hijos:[
                    {
                        nombre:'Recursos mineros', id:2,
                        hijos:[
                            {nombre:'Explotación minera sin licencia', id:2},
                            {nombre:'Explotación minera sin consulta a la población', id:2},
                            {nombre:'Afectación al medio ambiente', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Recursos hídicos', id:2,
                        hijos:[
                            {nombre:'Afectación de caudales por hidroeléctrica', id:2},
                            {nombre:'Contaminacion por actividades industriales', id:2},
                            {nombre:'Contaminación por falta de tratamiento de agua', id:2},
                            {nombre:'Desvío de cursos', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Recursos forestales', id:2,
                        hijos:[
                            {nombre:'Tala ilegal de bosques', id:2},
                            {nombre:'Incendios intencionados', id:2},
                            {nombre:'Conflicto de monocultivos', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    }
                ]
            },
            {
                nombre:'Conflictos relacionados a Energía eléctrica',
                id:6,
                hijos:[
                    {
                        nombre:'Generación hidroeléctrica', id:2,
                        hijos:[
                            {nombre:'Cuestionamientos a la producción  de energía eléctrica', id:2},
                            {nombre:'Conflictos con el transporte de energía eléctrica', id:2},
                            {nombre:'Conflictos con la distribución de energía eléctrica', id:2},
                            {nombre:'Actividades de la industria sin cumplir con las normas regulatorias', id:2},
                            {nombre:'Cuestionamiento al uso de recursos hídricos', id:2},
                            {nombre:'Afección al medio ambiente', id:2},
                            {nombre:'Incumplimiento con el compromiso con la comunidad', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Consumo de energía', id:2,
                        hijos:[
                            {nombre:'Conexiones irregulares', id:2},
                            {nombre:'Suspensión de energía eléctrica o mal servicio', id:2},
                            {nombre:'Falta de acceso a energía eléctrica', id:2},
                            {nombre:'Oposición al pago de servicio de suministro', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    }
                ]
            },
            {
                nombre:'Conflictos por restación de servicios públicos',
                id:6,
                hijos:[
                    {
                        nombre:'Salud', id:2,
                        hijos:[
                            {nombre:'Movilizaciones personal de salud', id:2},
                            {nombre:'Falta de cobertura de servicio de salud', id:2},
                            {nombre:'Asignación presupuestaria al sector salud', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Educación', id:2,
                        hijos:[
                            {nombre:'Acceso a servicios de educación', id:2},
                            {nombre:'Movilización de personal docente', id:2},
                            {nombre:'Falta de cobertura y recursos para brindar los servicios educativos', id:2},
                            {nombre:'Asiganción presupuestaria al sector Educativo', id:2},
                            {nombre:'Cobros ilegales', id:2},
                            {nombre:'Falta de personal docente', id:2},
                            {nombre:'Problemas con infraestructura educativa', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Seguridad', id:2,
                        hijos:[
                            {nombre:'Inseguridad ciudadana', id:2},
                            {nombre:'Corrupción policial', id:2},
                            {nombre:'Falta de cobertura policial', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Obras Públicas', id:2,
                        hijos:[
                            {nombre:'Falta de transparencia', id:2},
                            {nombre:'Costos de infraestructura', id:2},
                            {nombre:'Mala o tardía ejecución de obras', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Transporte Público', id:2,
                        hijos:[
                            {nombre:'Mal servicio de transporte', id:2},
                            {nombre:'Alzas en precio de transporte', id:2},
                            {nombre:'Falta o suspensión de servicio', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Atención de emergencias', id:2,
                        hijos:[
                            {nombre:'Apoyo y respuesta tardía a damnificados', id:2},
                            {nombre:'Escasez de productos básicos', id:2},
                            {nombre:'Alzas a precios a productos básicos', id:2},
                            {nombre:'Indiferencia o inacción  de autoridades', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    }
                ]
            },
            {
                nombre:'Conflictividad derivada del ejecicio de derechos',
                id:6,
                hijos:[
                    {
                        nombre:'Ejecicio de derechos laborales', id:2,
                        hijos:[
                            {nombre:'Conflicto laboral entre empleador y trabajador', id:2},
                            {nombre:'Huelgas', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Ejecicio de derechos públicos', id:2,
                        hijos:[
                            {nombre:'Impugnación de resultados electorales', id:2},
                            {nombre:'Disconformidad con autoridades', id:2},
                            {nombre:'Rechazo a leyes o medidas de la autoridad', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    },
                    {
                        nombre:'Derechos culturales', id:2,
                        hijos:[
                            {nombre:'Afección de sitios sagrados', id:2},
                            {nombre:'Discriminación', id:2},
                            {nombre:'Desconocimiento de costumbres y prácticas de pueblos indígenas', id:2},
                            {nombre:'Otros', id:2}
                        ]
                    }
                ]
            }
        ]
        const arbol = new japArbol(data);
        const html = arbol.hacer();
        console.log(html);
        $('#jap_cuerpo').append(html);
    }    
}