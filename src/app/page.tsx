"use client";
import LayeredTabs from "@/components/layeredTabs";

export default function Home() {
  return (
        <LayeredTabs >
          <LayeredTabs.Tab title='A' >
            hello A
          </LayeredTabs.Tab>
          <LayeredTabs.Tab >
            hello B
          </LayeredTabs.Tab>
        </LayeredTabs>
  );
}
