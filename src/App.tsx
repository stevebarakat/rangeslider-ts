import { RangeSlider } from './components/RangeSlider/RangeSlider';
import { VerticalRangeSlider } from './components/VerticalRangeSlider/VerticalRangeSlider';
import { DualRangeSlider } from './components/DualRangeSlider/DualRangeSlider';
import { DualVerticalRangeSlider } from './components/DualVerticalRangeSlider/DualVerticalRangeSlider';
import './shared/global.css';

function App() {
  return (
    <div>
      <RangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={50}
        showTicks={true}
        snap={false}
        customLabels={[{ 0: "low" }, { 50: "medium" }, { 100: "high" }]}
        showLabel={true}
        prefix=""
        suffix=""
        rotateLabel={false}
        blurColor="gray"
        primaryColor="black"
        width={800}
        thickTrack={false}
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
          { 0: "low" },
          { 50: "medium" },
          { 100: "high" }
        ]}
        showLabel={true}
        prefix=""
        suffix=""
        blurColor="gray"
        primaryColor="black"
        height={400}
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
          { 0: "low" },
          { 50: "medium" },
          { 100: "high" }
        ]}
        showLabel={true}
        prefix=""
        suffix=""
        rotateLabel={false}
        primaryColor="black"
        blurColor="gray"
        width={800}
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
          { 0: "low" },
          { 50: "medium" },
          { 100: "high" }
        ]}
        showLabel={true}
        prefix=""
        suffix=""
        primaryColor="black"
        blurColor="gray"
        height={400}
      />
    </div>
  );
}

export default App;
