import {useState, useEffect} from 'react'

import Header from './components/Header'
import Modal from './components/Modal'
import ListadoGastos from './components/ListadoGastos'
import Filtros from './components/Filtros'

import { generarId } from './helpers'

import IconoNuevoGasto from './img/nuevo-gasto.svg'

function App() {

   //AQUI SE ALMACENA CADA GASTO COMO UN OBJETO
   const [gastos, setGastos] = useState(
    //OBTIENE LOS GASTOS DESDE LS    CONVIERTE EL STRING A UN ARREGLO
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  );

  //SE DEFINE EL PRESUPUESTO CON LO QUE HAY EN localStorage, si no hay nada se asigna 0
  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  );

  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  //MODAL
  const [modal, setModal] = useState(false);
  //FORMULARIO
  const [animarModal, setAnimarModal] = useState(false)

  //EDITAR GASTO
  const [gastoEditar, setGastoEditar] = useState({})

  //STATE PARA FILTRAR LOS GASTOS POR CATEGORIA
  const [filtro, setFiltro] = useState('');
  //STATE PARA MOSTRAR LOS GASTOS FILTRADOS
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  //ESTARA ESCUCHANDO POR LOS CAMBIOS QUE SUCEDAN EN gastoEditar
  useEffect(() => {
    
    //SI SE HAY UN GASTO QUE EDITAR (SI SE HA ARRASTRADO EL BOTON EDITAR)
    if(Object.keys(gastoEditar).length > 0){
      //MUESTRA EL MODAL
      setModal(true);

      //MUESTRA EL FORMULARIO
      setTimeout( () => {
        setAnimarModal(true);
      }, 1000)

    }

  }, [gastoEditar]);

  //useEffect para el localStorage (presupuesto)
  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto]);

  //useEffect para el localStorage (gastos)
  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? []);
  }, [gastos])

  //ESCUCHA POR LOS CAMBIOS QUE SUCEDAN EN FILTRO
  useEffect(() => {
    if(filtro){
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)

      setGastosFiltrados(gastosFiltrados);
    }
  },[filtro])

  //SI HAY UN PRESUPUESTO, NO MUESTRA LA PRIMERA PANTALLA
  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;

    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  }, [])

  const handleNuevoGasto = () => {
    //MUESTRA EL MODAL
     setModal(true);

     setGastoEditar({});

     //MUESTRA EL FORMULARIO
     setTimeout( () => {
      setAnimarModal(true);
     }, 1000)

  }

  const guardarGasto = gasto => {

    if(gasto.id){
      //EDITANDO
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)

      setGastos(gastosActualizados);

      setGastoEditar({})

    } else {
      //NUEVO REGISTRO
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto]);
    }
    
    //OCULTA EL FORMULARIO
    setAnimarModal(false)

    //OCULTA EL MODAL
    setTimeout(() => {
      setModal(false);
    }, 1000)
  }

  const eliminarGasto = id => {
    //RETORNA UN NUEVO ARREGLO CON LOS GASTOS, A EXCEPCION DEL QUE SE ESTA ELIMINANDO
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);

    setTimeout(() => {
      setGastos(gastosActualizados);
    }, 1000)
    
  }

  return (
    //SI EL MODAL ESTA ACTIVO, AGREGA LA CLASE FIJAR
    <div className={modal ? 'fijar' : ''}>
      <Header
            presupuesto={presupuesto}
            setPresupuesto={setPresupuesto}
            isValidPresupuesto={isValidPresupuesto}
            setIsValidPresupuesto={setIsValidPresupuesto}
            gastos={gastos}
            setGastos={setGastos}
      />
      {/* SI isValidPresupuesto === true, MUESTRA EL BOTON */}
      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
                filtro={filtro}
                setFiltro={setFiltro}
            />
            <ListadoGastos
                gastos={gastos} 
                setGastoEditar={setGastoEditar} 
                eliminarGasto={eliminarGasto}
                filtro={filtro}
                gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img
                onClick={handleNuevoGasto}
                src={IconoNuevoGasto} 
                alt="icono-nuevo-gasto" />
          </div>
        </>
      )}
      {/* si modal === true, MUESTRA EL MODAL */}
      {modal && (
        <Modal
              setModal={setModal}
              animarModal={animarModal}
              setAnimarModal={setAnimarModal}
              guardarGasto={guardarGasto}
              gastoEditar={gastoEditar}
              setGastoEditar={setGastoEditar}
        />
      )}
    </div>
  )
}

export default App
