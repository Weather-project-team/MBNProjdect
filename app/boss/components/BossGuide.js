"use client";
import { useState } from "react";

export default function BossGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-white border border-gray-300 shadow mb-8">
      <h2 className="text-xl font-bold mb-3">📝 보스 젠 타이머 사용 가이드</h2>
      <p className="text-gray-700 mb-4">
        보스 처치 시간을 기록하고, 다음 젠 시간을 자동 계산해 알려주는 시스템입니다.
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="border border-gray-500 text-gray-800 px-4 py-2 hover:bg-gray-100 transition"
      >
        {isExpanded ? "▲ 가이드 닫기" : "▼ 처음 사용하시나요?"}
      </button>

      {isExpanded && (
        <div className="mt-6 text-gray-800 leading-relaxed">
          <h3 className="font-semibold text-lg mb-2">📌 기본 사용법</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>+ 버튼을 눌러 보스 정보를 입력 후 젠 타이머를 생성합니다.</li>
            <li><span className="font-semibold">게임명, 보스명, 리젠 시간</span>은 필수 입력입니다.</li>
            <li><span className="font-semibold">처치 버튼</span>을 누르면 현재 시간이 기록되고 다음 젠 시간이 자동 계산됩니다.</li>
            <li>+ <span className="font-semibold">수기로 처치시간 입력</span>을 통해 직접 입력도 가능합니다.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">🛠 주요 기능</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>게임별로 그룹화되어 보기 쉽게 정리됩니다.</li>
            <li>보스 타이머는 <span className="font-semibold">남은 시간이 가장 짧은 순서로 자동 정렬</span>됩니다.</li>
            <li>
              남은 시간이 <span className="text-red-500 font-semibold">5분 이내</span>면
              <span className="text-red-500 font-semibold"> ⚠️ "곧 등장!"</span> 경고 표시됩니다.
            </li>
            <li>젠 시간이 다 지나면 <span className="text-red-500 font-semibold">⚠️ "젠 완료!"</span>로 표시됩니다.</li>
            <li>
              <span className="font-semibold">젠 완료 보기 / 미완료 보기 / 1시간 이내 보기</span> 필터로 원하는 목록만 볼 수 있습니다.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">✍ 수정 & 수기 입력</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li><span className="font-semibold">[수정]</span> 버튼으로 모든 정보(이름, 위치, 리젠시간 등) 수정 가능합니다.</li>
            <li>처치시간과 리젠시간을 직접 수정하고 저장하면 다시 계산됩니다.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">📊 예시 화면</h3>
          <div className="mt-3">
            <img src="/images/timer_sort_example.png" alt="타이머 정렬 예시" className="w-full rounded border" />
            <p className="text-center text-sm text-gray-600 mt-2">남은 시간이 가장 짧은 순으로 정렬된 모습</p>
          </div>

          <div className="mt-4">
            <img src="/images/boss_alert_example.png" alt="보스 경고 예시" className="w-full rounded border" />
            <p className="text-center text-sm text-gray-600 mt-2">5분 이내 경고 표시 예시</p>
          </div>

          <h3 className="font-semibold text-lg mt-6 mb-2">❓ 자주 묻는 질문</h3>
          <p className="mt-2"><strong>Q.</strong> 보스 처치 시간을 다시 입력하고 싶어요.</p>
          <p><strong>A.</strong> 수정 버튼을 눌러 새로운 처치 시간과 리젠 시간을 입력 후 저장하시면 됩니다.</p>

          <p className="text-sm text-gray-500 mt-6">✅ 추가 문의사항은 언제든 알려주세요!</p>
        </div>
      )}
    </div>
  );
}
