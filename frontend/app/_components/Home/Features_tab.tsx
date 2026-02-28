import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { features } from "@/constants/features"

export default function FeaturesTabs() {
  return (
    <div className="w-full max-w-5xl mx-auto my-10">
      <Tabs defaultValue={features[0].id}>

        {/* Tab Buttons */}
        <TabsList className="grid grid-cols-3 bg-white self-center">
          {features.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {features.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="mt-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white text-center">
                {section.title}
              </h2>
              <p className="text-zinc-100 mt-2 text-center">
                {section.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {section.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 mt-2 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

          </TabsContent>
        ))}

      </Tabs>
    </div>
  )
}
