@if ($paginator->hasPages())
    <nav class="mt-3">
        <ul class="pagination pagination-gutter justify-content-end">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li class="page-item page-indicator" style="display: none!important;">
                    <a class="page-link" href="{{ $paginator->onFirstPage() }}" rel="İlk"><i class="fa fa-angle-double-left"></i></a>
                </li>
            @else
                <li class="page-item page-indicator">
                    <a class="page-link" href="{{ $paginator->previousPageUrl() }}" rel="Önceki" aria-label="@lang('pagination.previous')"><i class="la la-angle-left"></i></a>
                </li>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <li class="page-item" style="display: none!important;" aria-disabled="true"><span class="page-link">{{ $element }}</span></li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li class="page-item active" aria-current="page"><a class="page-link" href="javascript:void(0)">{{ $page }}</a></li>
                        @else
                            <li class="page-item"><a class="page-link" href="{{ $url }}">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li class="page-item">
                    <a class="page-link page-indicator" href="{{ $paginator->nextPageUrl() }}" rel="Sonraki" aria-label="@lang('pagination.next')"><i class="la la-angle-right"></i></a>
                </li>
            @else
                <li class="page-item" style="display: none!important;">
                    <a class="page-link page-indicator" href="{{ $paginator->lastPage() }}"><i class="fa fa-angle-double-right"></i></a>
                </li>
            @endif
        </ul>
    </nav>
@endif
