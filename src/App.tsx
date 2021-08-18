import { RangeSlider } from './components/RangeSlider/RangeSlider';
import { VerticalRangeSlider } from './components/VerticalRangeSlider/VerticalRangeSlider';
import { DualRangeSlider } from './components/DualRangeSlider/DualRangeSlider';
import { DualVerticalRangeSlider } from './components/DualVerticalRangeSlider/DualVerticalRangeSlider';

function App() {
  return (
    <div>
      {/* <RangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={10}
        showTicks={true}
        snap={true}
        customLabels={[{ 0: "logdfgdfgdfw" }, { 50: "medium" }, { 100: "high" }]}
        showLabel={true}
        prefix=""
        suffix=""
        rotateLabel={false}
        blurColor="pink"
        primaryColor="lightblue"
        width={800}
        wideTrack={false}
        showTooltip={true}
        labelColor="#995252"

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
        blurColor="pink"
        primaryColor="lightblue"
        height={400}
        wideTrack={true}
        showTooltip={true}
        labelColor="#0f0f0f"
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
        primaryColor="#8f3535"
        blurColor="gray"
        width={800}
        wideTrack={false}
        showTooltip={true}
        labelColor="#0c0c0c"
      />
      <DualVerticalRangeSlider
        initialLowerValue={20}
        initialUpperValue={40}
        min={0}
        max={500}
        decimals={0}
        step={10}
        snap={true}
        showTicks={true}
        customLabels={[
          { 0: "low" },
          { 50: "medium" },
          { 100: "high" }
        ]}
        // customLabels={[]}
        showLabel={true}
        prefix=""
        suffix=""
        primaryColor="black"
        blurColor="gray"
        height={400}
        showTooltip={true}
        labelColor="#111222"
      /> */}
    </div>
  );
}

export default App;
