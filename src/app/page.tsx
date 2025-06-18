"use client";
import LayeredTabs from "@/components/layeredTabs";

export default function Home() {
  return (

        <LayeredTabs

          //
          //
          // Todos las propiedades tienen valores predefinidos
          // Por lo que todas SON OPCIONALES
          //
          //

          fullWindow={true}         // Predefinido "false"
      
          fondoBarColor = "white"   // Predefinido "white"
          ptgnBarColor = "white"    // Predefinido "white"
          fondoColor = "white"      // Predefinido "white"
          slcPptgnColor = "white"   // Predefinido "white"

          tabBarPostn = {0}         // Posición de la barra de pestañas.
                                    // "0", "1", "2" o "3" 
                                    // Predefinido "0"

          maxSize = "xl"            // Tamaño máximo de barra de pestañas.
                                    // "xl", "lg", "md", "sm" o "xs"
                                    // Predefinido "xl"

          tabWidth = {8}            // Ancho de la barra de pestañas.
                                    // "5", "8" u "11", cualquier otra
                                    // cifra será acercada a una de las tres.
                                    // Predefinido "8"

          fixedMaxSize = {false}    // Tamaño fijo o dinámico en
                                    // relación al ancho de la ventana.
                                    // Fijo es "true"
                                    // Dinámico es "false"
                                    // Predefinido "false"
         
          >
          <LayeredTabs.Tab
          
              title='A'                     // Predefinido vacío
              titleLang = 'es'              // Idioma del título
                                            // "en","es","fr","de","it","pt" o "la"
                                            // Predefinido "en"

              independentBgColor = "white"  // Color de fondo. Predefinido "white"
              independentTxColor = "black"  // Color del texto. Predefinido "black"
          >
                                            {/* Contenido de las capas */}
                                            {/* Puede quedar vacío */}
            Hello A                         {/* Puede incluir texto plano */}
                                            {/* Puede incluir HTML */}

          </LayeredTabs.Tab>
          <LayeredTabs.Tab >
            Hello B
          </LayeredTabs.Tab>
        </LayeredTabs>
  );
}
