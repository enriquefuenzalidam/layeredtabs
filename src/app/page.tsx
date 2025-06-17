"use client";
import LayeredTabs from "@/components/layeredTabs";

export default function Home() {
  return (

        <LayeredTabs

          //
          //
          // Todas las opciones SON OPCIONALES
          // Todas las opciones tienen valores predefinidos
          //
          //

          fullWindow={true}         // predefinido 'false'
          fondoBarColor = "white"   // predefinido "white"
          ptgnBarColor = "white"    // predefinido "white"
          fondoColor = "white"      // predefinido "white"
          slcPptgnColor = "white"   // predefinido "white"
          tabBarPostn = {0}         // predefinido "0"
          maxSize = "xl"            // predefinido "xl"
          tabWidth = {8}            // predefinido "8"
          fixedMaxSize = {false}    // predefinido "false"
         
          >
          <LayeredTabs.Tab
    
              title='A'                     // predefinido vacío
              titleLang = 'es'              // predefinido "en"
              independentBgColor = "white"  // predefinido "white"
              independentTxColor = "black"  // predefinido "black"

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
