import { ShoppingCart, Award, Headphones, Shield, Truck, Gift } from "lucide-react"

const services = [
  {
    icon: ShoppingCart,
    title: "Chính sách mua hàng",
    description:
      "Chính sách mua hàng của chúng tôi đảm bảo trải nghiệm mua sắm thuận tiện, cùng sự hỗ trợ tận tâm từ đội ngũ chuyên nghiệp.",
  },
  {
    icon: Award,
    title: "Cam kết hàng chính hãng",
    description:
      "Chúng tôi cam kết mang đến cho khách hàng những lựa chọn tuyệt vời với sản phẩm chính hãng, chất lượng đảm bảo.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ tư vấn",
    description: "Dịch vụ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất.",
  },
  {
    icon: Shield,
    title: "Bảo mật thông tin khách hàng",
    description: "Thông tin cá nhân của bạn được bảo mật tuyệt đối với hệ thống an ninh hiện đại nhất.",
  },
  {
    icon: Truck,
    title: "Chính sách giao hàng",
    description: "Giao hàng nhanh chóng, an toàn đến tận nơi với đội ngũ vận chuyển chuyên nghiệp.",
  },
  {
    icon: Gift,
    title: "Quà tặng dành cho bạn",
    description: "Nhiều ưu đãi và quà tặng hấp dẫn dành riêng cho khách hàng thân thiết của chúng tôi.",
  },
]

export default function ServicesSection() {
  return (
    <section className="relative py-16 bg-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-400 font-medium text-lg mb-2">DỊCH VỤ</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">LÝ DO LỰA CHỌN CHÚNG TÔI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className="border border-gray-700 rounded-lg p-6 hover:border-amber-400 transition-colors duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-400 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
