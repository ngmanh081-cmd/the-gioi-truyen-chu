import type { Novel } from "../types";

const longChapter = [
  "Đêm xuống rất chậm trên thành phố cũ. Sau những mái ngói nâu đỏ là tiếng gió đi qua như một người khách quen, nhẹ đến mức không ai ngoài người đang thức có thể nghe thấy.",
  "An gấp quyển sổ đã cũ, đặt ngón tay lên dòng chữ cuối cùng của chương trước. Câu chuyện vẫn nằm yên trên trang giấy, nhưng trong lòng cậu, nó đã bắt đầu chuyển động.",
  "Ở phía bên kia con hẻm, ngọn đèn của hiệu sách bật sáng. Một người đàn ông mặc áo choàng xám đứng sau khung cửa kính, mỉm cười như đã chờ cậu từ rất lâu.",
  "Nếu mỗi truyện kể đều cần một người mở cửa, thì đêm nay, An biết mình không còn cách nào khác ngoài việc bước vào.",
  "Cánh cửa gỗ kêu lên khe khẽ. Mùi giấy cũ, trà nóng và mưa đầu mùa ùa ra, bao lấy cậu bằng một cảm giác vừa xa lạ vừa thân thuộc.",
  "Trên quầy, một tấm thẻ bằng đồng sáng lên. Tên An hiện ra từng nét một, như thể cửa hàng này đã biết cậu trước cả khi cậu biết chính mình."
].join("\n\n");

export const novels: Novel[] = [
  {
  id: "nhat-ky-hai-vuong",
  title: "Nhật Ký Hải Vương",
  author: "U Buồn Vương Tử",
  description:
    "Xuyên đến thế giới này đã hơn hai mươi bốn năm, cuối cùng hắn cũng thức tỉnh hệ thống. Tưởng rằng từ đây có thể từng bước bước lên đỉnh cao cuộc đời. Nhưng ai ngờ... hắc lịch sử còn nhiều hơn cả số tác phẩm từng tham gia. Không được, ta phải tẩy trắng...",
  coverImage: "/covers/nhat-ky-hai-vuong.jpg",
  categories: ["Đô thị", "Hệ thống", "Hài hước"],
  status: "Đang ra",
  rating: 4.8,
  views: "156K",
  chapters: [
    {
      order: 1,
      title: "Thức Tỉnh Hệ Thống",
      pdfUrl: "/chapters/nhat-ky-hai-vuong/chuong-1.pdf",
      content: [
        "Xuyên đến thế giới này đã hơn hai mươi bốn năm, cuối cùng hắn cũng thức tỉnh hệ thống.",
        "Tưởng rằng từ đây có thể từng bước bước lên đỉnh cao cuộc đời.",
        "Nhưng ai ngờ... hắc lịch sử còn nhiều hơn cả số tác phẩm từng tham gia.",
        "Không được, ta phải tẩy trắng..."
      ].join("\n\n")
    }
  ]
},
  {
    id: "thanh-pho-sau-trang-sach",
    title: "Thành Phố Sau Trang Sách",
    author: "Lam Vũ",
    description:
      "Một cậu học sinh phát hiện hiệu sách chỉ mở cửa sau nửa đêm, nơi mỗi cuốn truyện là lối vào một thành phố khác. Càng đọc, An càng nhận ra thành phố ấy đang gọi tên mình.",
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    categories: ["Huyền huyễn", "Phiêu lưu", "Đô thị"],
    status: "Đang ra",
    rating: 4.8,
    views: "128K",
    chapters: [
      { order: 1, title: "Người Mở Cửa", content: longChapter },
      {
        order: 2,
        title: "Hiệu Sách Không Ngủ",
        content: `${longChapter}\n\nỞ cuối căn phòng, chiếc cầu thang xoắn dẫn xuống một tầng hầm không có trong bản vẽ của bất kỳ ngôi nhà nào trên con phố.`
      }
    ]
  },
  {
    id: "kiem-anh-mua-ha",
    title: "Kiếm Ảnh Mùa Hạ",
    author: "Hạ Minh",
    description:
      "Thiếu niên mang thanh kiếm gãy rời khỏi làng núi, bước vào giang hồ đúng mùa hạ rực rỡ nhất, nơi ân oán cũ vẫn cháy âm ỉ sau những nụ cười.",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    categories: ["Kiếm hiệp", "Hành động"],
    status: "Đang ra",
    rating: 4.6,
    views: "96K",
    chapters: [
      { order: 1, title: "Thanh Kiếm Gãy", content: longChapter },
      { order: 2, title: "Khách Qua Đèo", content: longChapter }
    ]
  },
  {
    id: "tram-tau-tinh-van",
    title: "Trạm Tàu Tinh Vân",
    author: "Kỳ Nam",
    description:
      "Ở rìa dải ngân hà có một trạm tàu nơi mọi chuyến đi đều đổi bằng ký ức. Một kỹ sư trẻ phải chọn giữa cứu người mình yêu và giữ lại chính mình.",
    coverImage:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=900&q=80",
    categories: ["Khoa huyễn", "Lãng mạn"],
    status: "Hoàn thành",
    rating: 4.9,
    views: "212K",
    chapters: [
      { order: 1, title: "Chuyến Tàu Số 0", content: longChapter },
      { order: 2, title: "Ký Ức Để Quên", content: longChapter }
    ]
  },
  {
    id: "quan-tra-cuoi-hem",
    title: "Quán Trà Cuối Hẻm",
    author: "Mộc An",
    description:
      "Quán trà nhỏ nhận những vị khách đang lạc mất điều quan trọng nhất. Mỗi chén trà là một câu chuyện đời thường, ấm áp và đôi khi hơi nhói lòng.",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    categories: ["Đời thường", "Chữa lành"],
    status: "Hoàn thành",
    rating: 4.7,
    views: "74K",
    chapters: [
      { order: 1, title: "Vị Khách Đầu Tiên", content: longChapter },
      { order: 2, title: "Chén Trà Hoa Quế", content: longChapter }
    ]
  },
  {
    id: "mat-ma-vuong-trieu",
    title: "Mật Mã Vương Triều",
    author: "Tần Du",
    description:
      "Một học giả trẻ giải mã bức thư cổ và vô tình bước vào cuộc tranh quyền giữa các thế lực trong hoàng thành, nơi mọi lời nói đều có thể là cạm bẫy.",
    coverImage:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    categories: ["Lịch sử", "Trinh thám"],
    status: "Đang ra",
    rating: 4.5,
    views: "88K",
    chapters: [
      { order: 1, title: "Bức Thư Niêm Phong", content: longChapter },
      { order: 2, title: "Đêm Trong Thư Các", content: longChapter }
    ]
  },
  {
    id: "hoc-vien-lap-trinh-su",
    title: "Học Viện Lập Trình Sư",
    author: "Quang Duy",
    description:
      "Trong thế giới nơi phép thuật được viết bằng mã nguồn, một tân sinh viên phải debug lời nguyền cổ trước khi cả học viện sụp đổ.",
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    categories: ["Fantasy", "Học viện", "Hài hước"],
    status: "Đang ra",
    rating: 4.4,
    views: "63K",
    chapters: [
      { order: 1, title: "Dòng Lệnh Đầu Tiên", content: longChapter },
      { order: 2, title: "Bài Kiểm Tra Lửa", content: longChapter }
    ]
  },
  {
    id: "viet-linh",
    title: "Việt Linh",
    author: "Peter Heart",
    description:
      "Một linh sư trẻ lần theo dấu tích cổ ở biên giới phía Bắc và phát hiện huyết mạch của mình gắn với lời thề bảo hộ long mạch Đại Việt.",
    coverImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    categories: ["Huyền huyễn", "Lịch sử"],
    status: "Đang ra",
    rating: 4.9,
    views: "201K",
    chapters: [{ order: 1, title: "Long Mạch Thức Tỉnh", content: longChapter }]
  },
  {
    id: "mat-ma-vuong-trieu-2",
    title: "Mặt Mã Vương Triều",
    author: "Nguyên Hạc",
    description:
      "Sau khi triều cũ sụp đổ, một mật thám lưu vong phải giải mã bảy bản đồ máu để tìm kho báu bị chôn dưới kinh thành.",
    coverImage:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=900&q=80",
    categories: ["Trinh thám", "Lịch sử"],
    status: "Đang ra",
    rating: 4.5,
    views: "144K",
    chapters: [{ order: 1, title: "Bảy Bản Đồ Máu", content: longChapter }]
  },
  {
    id: "dai-viet-chien-ky",
    title: "Đại Việt Chiến Ký",
    author: "Đông A",
    description:
      "Từ một binh tốt vô danh, chàng thiếu niên bước vào những trận chiến định mệnh để viết lại thiên mệnh của non sông.",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    categories: ["Lịch sử", "Hành động"],
    status: "Đang ra",
    rating: 4.6,
    views: "188K",
    chapters: [{ order: 1, title: "Cờ Lệnh Bên Sông", content: longChapter }]
  },
  {
    id: "noi-sao-hi-vong",
    title: "Ngôi Sao Hi Vọng",
    author: "Bạch Dương",
    description:
      "Một phi công trẻ mang theo lời hứa của quê nhà, vượt qua chiến tuyến tinh hà để tìm hành tinh cuối cùng còn ánh sáng.",
    coverImage:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
    categories: ["Khoa huyễn", "Phiêu lưu"],
    status: "Hoàn thành",
    rating: 4.7,
    views: "173K",
    chapters: [{ order: 1, title: "Tín Hiệu Từ Vành Đai", content: longChapter }]
  },
  {
    id: "ta-la-hoang-de-dai-nam",
    title: "Ta Là Hoàng Đế Đại Nam",
    author: "Tào Ca",
    description:
      "Tỉnh lại trong thân xác một vị hoàng tử bị ruồng bỏ, hắn dùng trí nhớ hiện đại để xoay chuyển vận mệnh một vương triều.",
    coverImage:
      "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&w=900&q=80",
    categories: ["Lịch sử", "Xuyên không"],
    status: "Đang ra",
    rating: 4.8,
    views: "198K",
    chapters: [{ order: 1, title: "Hoàng Tử Bị Quên Lãng", content: longChapter }]
  },
  {
    id: "tro-ve-1986",
    title: "Trở Về 1986: Trở Thành Nhà Giàu Nhất",
    author: "Hải Nam",
    description:
      "Mang theo ký ức tương lai, một doanh nhân thất bại quay về tuổi trẻ và bắt đầu hành trình xây dựng đế chế của riêng mình.",
    coverImage:
      "https://images.unsplash.com/photo-1517242027094-631f8c218a0f?auto=format&fit=crop&w=900&q=80",
    categories: ["Đô thị", "Trọng sinh"],
    status: "Đang ra",
    rating: 4.4,
    views: "119K",
    chapters: [{ order: 1, title: "Ngày Mưa Năm 1986", content: longChapter }]
  },
  {
    id: "de-quoc-dai-viet",
    title: "Đế Quốc Đại Việt",
    author: "Nam Sơn",
    description:
      "Một chiến lược gia trẻ bước vào vòng xoáy quyền lực, nơi mỗi quyết định có thể mở rộng bờ cõi hoặc đẩy cả triều đại vào biển lửa.",
    coverImage:
      "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=900&q=80",
    categories: ["Lịch sử", "Chiến tranh"],
    status: "Hoàn thành",
    rating: 4.6,
    views: "120K",
    chapters: [{ order: 1, title: "Chiếu Lệnh Đầu Tiên", content: longChapter }]
  },
  {
    id: "ma-chung",
    title: "Ma Chủng",
    author: "Hắc Nguyệt",
    description:
      "Trong một thế giới bị lời nguyền ăn mòn, cô gái mang ma chủng trong tim phải chọn giữa cứu nhân gian và đánh thức bản ngã hắc ám.",
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    categories: ["Huyền huyễn", "Linh dị"],
    status: "Đang ra",
    rating: 4.5,
    views: "97K",
    chapters: [{ order: 1, title: "Hạt Giống Trong Tim", content: longChapter }]
  },
  {
    id: "thinh-the-dai-co-viet",
    title: "Thịnh Thế Đại Cổ Việt",
    author: "Tùng Lâm",
    description:
      "Từ một ngôi làng ven sông, những con người trẻ tuổi bước vào thời đại khai mở, dựng nên một thịnh thế bằng máu và niềm tin.",
    coverImage:
      "https://images.unsplash.com/photo-1475738972911-5b44ce984c42?auto=format&fit=crop&w=900&q=80",
    categories: ["Lịch sử", "Phiêu lưu"],
    status: "Đang ra",
    rating: 4.7,
    views: "138K",
    chapters: [{ order: 1, title: "Lửa Bên Bến Sông", content: longChapter }]
  },
  {
    id: "nhat-ky-sinh-ton-cua-ta",
    title: "Nhật Ký Sinh Tồn Của Ta",
    author: "Mạn Châu",
    description:
      "Bị ném vào vùng đất không bản đồ, nàng ghi lại từng ngày sinh tồn, từng bí mật của rừng sâu và từng kẻ thù mang mặt người quen.",
    coverImage:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    categories: ["Sinh tồn", "Phiêu lưu"],
    status: "Hoàn thành",
    rating: 4.3,
    views: "82K",
    chapters: [{ order: 1, title: "Ngày Không Có Mặt Trời", content: longChapter }]
  }
];

export const categories = [
  "Tiên hiệp",
  "Huyền huyễn",
  "Kỳ huyễn",
  "Võ hiệp",
  "Đô thị",
  "Dị năng",
  "Hệ thống",
  "Xuyên không",
  "Trọng sinh",
  "Xuyên việt",
  "Mạt thế",
  "Tận thế",
  "Khoa huyễn",
  "Tinh tế",
  "Cơ giáp",
  "Linh dị",
  "Kinh dị",
  "Trinh thám",
  "Huyền nghi",
  "Quân sự",
  "Lịch sử",
  "Quan trường",
  "Thương trường",
  "Game",
  "Võng du",
  "Esports",
  "Đồng nhân",
  "Fanfiction",
  "Vô hạn lưu",
  "Khủng bố lưu",
  "Sinh tồn",
  "Phiêu lưu",
  "Thám hiểm",
  "Cạnh tranh",
  "Học đường",
  "Thanh xuân",
  "Hài hước",
  "Sảng văn",
  "Não động",
  "Nhật thường",
  "Gia đấu",
  "Triều đấu",
  "Cung đấu",
  "Điền văn",
  "Làm ruộng",
  "Xây dựng thế lực",
  "Kiến quốc",
  "Kinh doanh",
  "Livestream",
  "Giải trí",
  "Văn sao",
  "Thần hào",
  "Đánh dấu",
  "Tu tiên hiện đại",
  "Tag thường dùng",
  "Vô địch",
  "Thiên tài",
  "Phế vật nghịch tập",
  "Cẩu đạo",
  "Sát phạt quyết đoán",
  "Nhiều nữ chính",
  "Một vợ một chồng",
  "Không nữ chính",
  "Báo thù",
  "Nghịch tập",
  "Boss",
  "Phản diện",
  "Vai phụ",
  "Phụ thân lưu",
  "Dưỡng thành",
  "Thu đồ",
  "Tông môn",
  "Gia tộc",
  "Đế vương",
  "Vương triều",
  "Sủng vật",
  "Khế ước",
  "Long ngạo thiên",
  "Địch hóa",
  "Đánh dấu nhận thưởng",
  "Check-in",
  "Mô phỏng",
  "Triệu hoán",
  "Chư thiên",
  "Vạn giới",
  "Xuyên nhanh",
  "Nhiệm vụ",
  "Chat group",
  "Hack",
  "Linh khí khôi phục",
  "Thần thoại",
  "Tây du",
  "Hồng Hoang",
  "Pokémon",
  "Marvel",
  "DC"
];
