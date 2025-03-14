export default function page() {
  return (
    <div>
      <h1>게임 페이지</h1>
      <div>카테고리</div>

      <div>
        <form>
          <input placeholder="제목" />
          <input placeholder="카테고리" />
          <input placeholder="본문" />
          <button>생성</button>
        </form>
      </div>
    </div>
  );
}
