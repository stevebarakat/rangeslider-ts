import { RangeSlider } from './components/RangeSlider/RangeSlider';
import { VerticalRangeSlider } from './components/VerticalRangeSlider/VerticalRangeSlider';
import { DualRangeSlider } from './components/DualRangeSlider/DualRangeSlider';
import { DualVerticalRangeSlider } from './components/DualVerticalRangeSlider/DualVerticalRangeSlider';

function App() {
  return (
    <div>
      <RangeSlider
        initialValue={50}
        min={21}
        max={51}
        step={0}
        showTicks={true}
        snap={true}
        customLabels={[]}
        // customLabels={[{ 0: "logdfgdfgdfw" }, { 50: "medium" }, { 100: "hfsdfsdfbcbgfgdgh" }]}
        showLabels={true}
        prefix=""
        suffix=""
        rotateLabels={false}
        width={800}
        wideTrack={false}
        showTooltip={true}

      />
      <VerticalRangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={5}
        showTicks={true}
        snap={true}
        customLabels={[]}
        // customLabels={[
        //   { 0: "loffgfdgdgdsfsfsfsfsdfsgdfw" },
        //   { 50: "meum" },
        //   { 100: "high" }
        // ]}
        showLabels={true}
        prefix=""
        suffix=""
        height={400}
        wideTrack={true}
        showTooltip={true}
      />
      <DualRangeSlider
        initialLowerValue={20}
        initialUpperValue={40}
        min={0}
        max={100}
        decimals={0}
        step={10}
        snap={true}
        showTicks={true}
        // customLabels={[
        //   { 0: "lgf" },
        //   { 50: "mdm" },
        //   { 100: "hh" }
        // ]}
        customLabels={[]}
        showLabels={true}
        prefix=""
        suffix=""
        rotateLabels={false}
        width={800}
        wideTrack={false}
        showTooltip={true}
      />
      <DualVerticalRangeSlider
        initialLowerValue={20}
        initialUpperValue={40}
        min={0}
        max={100}
        decimals={0}
        step={10}
        snap={true}
        showTicks={true}
        customLabels={[
          { 0: "ljh" },
          { 50: "mgm" },
          { 100: "h" }
        ]}
        // customLabels={[]}
        showLabels={true}
        prefix=""
        suffix=""
        height={400}
        showTooltip={true}
      />
    </div>
  );
}

export default App;
