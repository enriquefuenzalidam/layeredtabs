"use client";
import LayeredTabs from "@/components/layeredTabs";

export default function Home() {
  return (

        <LayeredTabs

          //
          //
          // Todos los argumentos SON OPCIONALES
          // Todos las argumentos tienen valores predefinidos
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

          maxSize = "xl"            // "xl", "lg", "md", "sm" o "xs"
                                    // Predefinido "xl"

          tabWidth = {8}            // "5", "8" o "11"
                                    // Predefinido "8"

          fixedMaxSize = {false}    // Tamaño responsivo en
                                    // relación al ancho de
                                    // la ventana.
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
                                           {/* Puede ser dejado vacío */}
            Hello A                        {/* Puede incluir texto plano */}
                                           {/* Puede incluir HTML */}

          </LayeredTabs.Tab>
          <LayeredTabs.Tab >
            Hello B
          </LayeredTabs.Tab>
        </LayeredTabs>
  );
}
