"use client";

import { Tabs } from "@/components/ui/tabs";

export default function TabsDemo() {
  const tabs = [
    {
      title: "Create",
      value: "create",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-12 md:p-16 text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <div className="space-y-16 md:space-y-20">
            {/* Section principale */}
            <div className="text-center space-y-8 py-8 md:py-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Content Creation<br />That Converts
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto">
                We turn your existing content into thousands of high-performing short-form videos.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">AI-Powered Editing</h3>
                  <p className="text-purple-100">
                    Our AI analyzes your existing content and automatically generates optimized variations for each platform.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">Format Optimization</h3>
                  <p className="text-purple-100">
                    Automatic adaptation for TikTok, Instagram Reels, YouTube Shorts with the right dimensions and durations.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">Trending Integration</h3>
                  <p className="text-purple-100">
                    Integration of current trends, popular hashtags and viral elements to maximize reach.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">Brand Consistency</h3>
                  <p className="text-purple-100">
                    Maintaining your visual identity and brand message across all created variations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Distribute",
      value: "distribute",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-12 md:p-16 text-white bg-gradient-to-br from-blue-700 to-cyan-900">
          <div className="space-y-16 md:space-y-20">
            {/* Section principale */}
            <div className="text-center space-y-8 py-8 md:py-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Market Domination<br />Through Scale
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
                We publish videos across fully branded sub-accounts, ensuring market domination.
              </p>
            </div>

            {/* Network Stats */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">10,000+</div>
                <div className="text-blue-100 mt-2">Sub-Accounts</div>
                <div className="text-sm text-blue-200 mt-1">Global network</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">1,800-18,000</div>
                <div className="text-blue-100 mt-2">Videos/Month</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">24/7</div>
                <div className="text-blue-100 mt-2">Publishing</div>
                <div className="text-sm text-blue-200 mt-1">Automated</div>
              </div>
            </div>

            {/* Distribution Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-2">Strategic Timing</h3>
                <p className="text-blue-100">
                  Publishing at optimal times according to each timezone and platform algorithm.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-2">Brand Protection</h3>
                <p className="text-blue-100">
                  All accounts are fully branded and protected to maintain your reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Convert",
      value: "convert",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-12 md:p-16 text-white bg-gradient-to-br from-green-700 to-emerald-900">
          <div className="space-y-16 md:space-y-20">
            {/* Section principale */}
            <div className="text-center space-y-8 py-8 md:py-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Traffic That<br />Actually Converts
              </h2>
              <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto">
                All traffic is redirected to your socials, offers, and sales funnels, leading to massive audience growth and revenue.
              </p>
            </div>

            {/* Conversion Stats */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">2B+</div>
                <div className="text-green-100 mt-2">Total Views</div>
                <div className="text-sm text-green-200 mt-1">Across all platforms</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">300+</div>
                <div className="text-green-100 mt-2">Creators, Artists and Brands</div>
                <div className="text-sm text-green-200 mt-1">Helped</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl md:text-4xl font-bold">500+</div>
                <div className="text-green-100 mt-2">Creator Network</div>
                <div className="text-sm text-green-200 mt-1">Global reach</div>
              </div>
            </div>

            {/* Conversion Features */}
            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-2">Smart Redirection</h3>
                <p className="text-green-100">
                  Smart links that direct to your main profiles, stores and sales funnels.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[40rem] md:h-[60rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-32">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <img
      src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1000&h=1000&fit=crop"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
}; 