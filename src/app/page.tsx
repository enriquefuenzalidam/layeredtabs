"use client";
import LayeredTabs from "@/components/layeredTabs";

export default function Home() {
  return (

        <LayeredTabs

          //
          //
          // Todas las propiedades tienen
          // valores predefinidos, por lo
          // que todas SON OPCIONALES de
          // ser especificadas. Pero aquí
          // sí son especificadas todas con
          // el fin de ser descritas y
          // explicadas.
          //
          //

          containerAlto="100%"      // Alto del caja contenedora del
                                    // componente. Efectiva solo si
                                    // "fullWindow" es "false"
                                    /// Predefinido "10%%".
                                  
          fullWindow={true}         // Hace que el componente llene
                                    // toda la ventana, sea lo que
                                    // sea que halla en el resto de
                                    // la página.
                                    /// Predefinido "false".
                                  


          fondoBarColor = "white"   // Color del fondo de la barra de pestañas.
                                    /// Predefinido "white".

          ptgnBarColor = "white"    // Color de las pestañas.
                                    /// Predefinido "white".

          slcPptgnColor = "white"   // Color para la pestaña seleccionada.
                                    /// Predefinido "white".
           
          fondoColor = "white"      // Color de fondo del contenedor del
                                    // componente y de las capas que no
                                    // tengan ningún color definido.
                                    /// Predefinido "white".


          tabBarPostn = {0}         // Posición de la barra de pestañas.
                                    // "0", "1", "2" o "3", cualquier otra
                                    // cifra, será reemplazada por la predefinida.
                                    /// Predefinido "0".

          tabWidth = {8}            // Ancho de la barra de pestañas.
                                    // "5", "8" u "11", cualquier otro valor,
                                    // será acercado a uno de los tres.
                                    /// Predefinido "8".

          maxSize = "xl"            // Tamaño máximo de barra de pestañas.
                                    // "xl", "lg", "md", "sm" o "xs", cualquier
                                    // otro valor, será reemplazado por el predefinido.
                                    /// Predefinido "xl".

          fixedMaxSize = {false}    // Tamaño fijo o dinámico en relación al
                                    // ancho de la ventana. "True" fija el
                                    // tamaño definido por "maxSize".
                                    // Fijo es "true" y dinámico es "false".
                                    /// Predefinido "false".
         
          >
          <LayeredTabs.Tab
          
              title='A'                     /// Predefinido vacío.

              titleLang = 'es'              // Idioma del título
                                            // "en","es","fr","de","it","pt" o "la"
                                            /// Predefinido "en".

              independentBgColor = "white"  // Color de fondo de la capa y pestaña.
                                            /// Predefinido "white".

              independentTxColor = "black"  // Color del texto de la capa y pestaña.
                                            /// Predefinido "black".
          >
                                            {/* El contenido de las capas
                                                puede quedar vacío, incluir
                                                texto plano o HTML. */}

            Hello A  

          </LayeredTabs.Tab>
          <LayeredTabs.Tab >
            Hello B
          </LayeredTabs.Tab>
        </LayeredTabs>
  );
}
