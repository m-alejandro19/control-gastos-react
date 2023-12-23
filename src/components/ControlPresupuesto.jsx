import { useState, useEffect } from "react";

import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import {formatearCantidad} from '../helpers';

const ControlPresupuesto = ({presupuesto, setPresupuesto, gastos, setGastos, setIsValidPresupuesto}) => {

    const [disponible, setDisponible] = useState(0);
    const [gastado, setGastado] = useState(0);
    const [porcentaje, setPorcentaje] = useState(0);

    useEffect(() => {
                                                                              
        const totalGastado = gastos.reduce((total, gasto) => gasto.cantidad + total, 0);

        const totalDisponible = presupuesto - totalGastado;

        setDisponible(totalDisponible);

        setGastado(totalGastado);

        const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto ) * 100).toFixed(2);

        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje);
        }, 1500);

    }, [gastos])

    const handleResetApp = () => {
        const resultado = confirm('¿Deseas resetear la App?');

        if(resultado){
            setGastos([]);
            setPresupuesto(0);
            setIsValidPresupuesto(false);
        }
    };

  return (
    <div className="contenedor-presupuesto contenedor sombra dos-columnas">
        <div>
            <CircularProgressbar
                    value={porcentaje}
                    text={`${porcentaje}% Gastado`}
                    background
                    backgroundPadding={6}
                    styles={buildStyles({
                        backgroundColor: '#3B82F6',
                        textColor: '#FFF',
                        pathColor: disponible < 0 ? '#DC2626': '#FFF',
                        trailColor: 'transparent'
                    })}
            />
        </div>
        <div className="contenido-presupuesto">
            <button
                className="reset-app"
                type="button"
                onClick={handleResetApp}
            >
                Resetear APP
            </button>
            <p>
                <span>Presupuesto: </span>{formatearCantidad(presupuesto)} 
            </p>
            <p className={disponible < 0 ? 'negativo' : '' }>
                <span>Disponible: </span>{formatearCantidad(disponible)} 
            </p>
            <p>
                <span>Gastado: </span>{formatearCantidad(gastado)} 
            </p>
        </div>
    </div>
  )
}

export default ControlPresupuesto;