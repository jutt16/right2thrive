"use client";

export default function MagazineSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#00990d] mb-8">
          Right2Thrive UK Magazine
        </h2>

        <div
          style={{
            position: "relative",
            paddingTop: "max(60%, 326px)",
            height: 0,
            width: "100%",
          }}
        >
          <iframe
            allow="clipboard-write"
            sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
            allowFullScreen={true}
            style={{
              position: "absolute",
              border: "none",
              width: "100%",
              height: "100%",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            src="https://e.issuu.com/embed.html?d=right2thrive_uk_magazine&u=www.right2thriveuk.com"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
