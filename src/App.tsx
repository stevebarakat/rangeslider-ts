import { RangeSlider } from './components/RangeSlider/RangeSlider';
import { VerticalRangeSlider } from './components/VerticalRangeSlider/VerticalRangeSlider';
import { DualRangeSlider } from './components/DualRangeSlider/DualRangeSlider';
import { DualVerticalRangeSlider } from './components/DualVerticalRangeSlider/DualVerticalRangeSlider';

function App() {
  return (
    <div>
      <RangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={10}
        showTicks={true}
        snap={true}
        // customLabels={[]}
        customLabels={[{ 0: "logdfgdfgdfw" }, { 50: "medium" }, { 100: "hfsdfsdfbcbgfgdgh" }]}
        showLabels={true}
        prefix=""
        suffix=""
        rotateLabel={true}
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
        customLabels={[
          { 0: "logdfgdgdgdgdgdgdgdgdgdgfdfw" },
          { 50: "medium" },
          { 100: "high" }
        ]}
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
        customLabels={[
          { 0: "lodfgddgf" },
          { 50: "medium" },
          { 100: "hhfghfhfhfhfghhfghfgigh" }
        ]}
        showLabels={true}
        prefix=""
        suffix=""
        rotateLabel={true}
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
          { 0: "lowkjgkjhkjhkjhkjhkjhkjh" },
          { 50: "medium" },
          { 100: "high" }
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
